import {get, orderBy} from 'lodash'
import * as THREE from 'three'
import {BufferGeometry, Intersection, Vector3} from 'three'
import {DisplayNode, Nodes} from './Nodes'

const MAX_CLICK_DURATION = 300

type GenericMouseEventHandler = (
  event: MouseEvent,
  nodeIdx: number | null,
  worldSpacePosition: THREE.Vector3,
) => any

/**
 * dispatched when a node is hovered in or out
 */
export type HoverEventHandler = (hoveredIdx: number) => any

/**
 * dispatched when the canvas is clicked. if a node click is detected the clickedNodeIdx will be non-null
 */
export type ClickEventHandler = GenericMouseEventHandler

/**
 * dispatched when a mouse drag start is detected anywhere on the canvas
 */
export type DragStartEventHandler = GenericMouseEventHandler

/**
 * dispatched when a mouse drag end is detected anywhere on the canvas
 */
export type DragEndEventHandler = GenericMouseEventHandler

/**
 * dispatched when a mouse dragging event is detected after dragStart was dispatched with a non-null node
 * i.e. node was dragged
 */
export type NodeDragEventHandler = (
  event: MouseEvent,
  worldSpaceMousePosition: THREE.Vector3,
  draggedNodeIdx: number,
) => any

/**
 * dispatched when a mouse dragging event is detected after dragStart was dispatched with a null node
 * i.e. canvas was panned
 */
export type PanEventHandler = (
  event: MouseEvent,
  worldSpaceMousePosition: THREE.Vector3,
  panDelta: THREE.Vector3,
) => any

/**
 * dispatched when a mouse dragging event is detected and dragMode is set to 'select'
 */
export type DragSelectEventHandler = (
  event: MouseEvent,
  worldSpaceMousePosition: THREE.Vector3,
  selection: number[],
) => any

/**
 * dispatched on mouse wheel change
 */
export type ZoomEventHandler = (event: WheelEvent) => any

/**
 * dispatched on event: 'contextmenu'
 * (usually right click or Ctrl+click in most browsers)
 */
export type SecondaryClickEventHandler = (
  event: MouseEvent,
  nodeIdx: number | null,
) => any

interface EventHandlerMap {
  click: Map<string, ClickEventHandler>
  nodeHoverIn: Map<string, HoverEventHandler>
  nodeHoverOut: Map<string, HoverEventHandler>
  dragStart: Map<string, DragStartEventHandler>
  dragEnd: Map<string, DragEndEventHandler>
  nodeDrag: Map<string, NodeDragEventHandler>
  dragSelect: Map<string, DragSelectEventHandler>
  pan: Map<string, PanEventHandler>
  zoom: Map<string, ZoomEventHandler>
  secondaryClick: Map<string, SecondaryClickEventHandler>
}

export class MouseInteraction {
  private nodesData: DisplayNode[]
  private dragMode: 'drag' | 'select' = 'select'
  private intersectedPointIdx: number | null
  private dragging: boolean
  private registerClick: boolean
  private registeredEventHandlers: EventHandlerMap = {
    click: new Map<string, ClickEventHandler>(),
    nodeHoverIn: new Map<string, HoverEventHandler>(),
    nodeHoverOut: new Map<string, HoverEventHandler>(),
    dragStart: new Map<string, DragStartEventHandler>(),
    dragEnd: new Map<string, DragEndEventHandler>(),
    nodeDrag: new Map<string, NodeDragEventHandler>(),
    dragSelect: new Map<string, DragSelectEventHandler>(),
    pan: new Map<string, PanEventHandler>(),
    zoom: new Map<string, ZoomEventHandler>(),
    secondaryClick: new Map<string, SecondaryClickEventHandler>(),
  }

  private readonly nodesMesh: Nodes
  private readonly canvas: HTMLCanvasElement
  private readonly camera: THREE.OrthographicCamera
  private readonly panStart: THREE.Vector3
  private readonly panEnd: THREE.Vector3
  private readonly panDelta: THREE.Vector3
  private readonly mouse: THREE.Vector2
  private readonly raycaster: THREE.Raycaster

  // frustum used to represent the selection box
  private readonly frustum = {
    start: new Vector3(),
    end: new Vector3(),
  }

  constructor(
    canvas: HTMLCanvasElement,
    camera: THREE.OrthographicCamera,
    nodesMesh: Nodes,
    nodesData: DisplayNode[],
  ) {
    this.canvas = canvas
    this.camera = camera
    this.nodesMesh = nodesMesh
    this.nodesData = nodesData

    this.intersectedPointIdx = null
    this.dragging = false
    this.registerClick = false

    this.panStart = new THREE.Vector3()
    this.panEnd = new THREE.Vector3()
    this.panDelta = new THREE.Vector3()

    this.mouse = new THREE.Vector2(0, 0) // normalized mouse coordinates (x, y, z): [-1, 1]
    this.raycaster = new THREE.Raycaster()
    this.raycaster.params.Points!.threshold = 40

    this.canvas.addEventListener('mousedown', this.onMouseDown)
    this.canvas.addEventListener('mousemove', this.onMouseMove)
    this.canvas.addEventListener('mouseup', this.onMouseUp)
    this.canvas.addEventListener('wheel', this.onMouseWheel)
    this.canvas.addEventListener('contextmenu', this.onContextMenu)
  }

  public updateData(nodesData: DisplayNode[]) {
    this.nodesData = nodesData
  }

  public addEventListener(
    eventName: 'click',
    eventListenerKey: string,
    callback: ClickEventHandler,
  ): void
  public addEventListener(
    eventName: 'nodeHoverIn',
    eventListenerKey: string,
    callback: HoverEventHandler,
  ): void
  public addEventListener(
    eventName: 'nodeHoverOut',
    eventListenerKey: string,
    callback: HoverEventHandler,
  ): void
  public addEventListener(
    eventName: 'dragStart',
    eventListenerKey: string,
    callback: DragStartEventHandler,
  ): void
  public addEventListener(
    eventName: 'dragEnd',
    eventListenerKey: string,
    callback: DragEndEventHandler,
  ): void
  public addEventListener(
    eventName: 'nodeDrag',
    eventListenerKey: string,
    callback: NodeDragEventHandler,
  ): void
  public addEventListener(
    eventName: 'pan',
    eventListenerKey: string,
    callback: PanEventHandler,
  ): void
  public addEventListener(
    eventName: 'zoom',
    eventListenerKey: string,
    callback: ZoomEventHandler,
  ): void
  public addEventListener(
    eventName: 'secondaryClick',
    eventListenerKey: string,
    callback: SecondaryClickEventHandler,
  ): void
  public addEventListener(
    eventName: 'dragSelect',
    eventListenerKey: string,
    callback: DragSelectEventHandler,
  ): void

  /**
   * adds an event listener
   */
  public addEventListener(
    eventName: keyof EventHandlerMap,
    eventListenerKey: string,
    callback: any,
  ) {
    this.registeredEventHandlers[eventName].set(eventListenerKey, callback)
  }

  /**
   * removes a registered event handler by reference
   */
  public removeEventListener(
    eventName: keyof EventHandlerMap,
    eventListenerKey: string,
  ) {
    this.registeredEventHandlers[eventName].delete(eventListenerKey)
  }

  /**
   * gets a reference to a registered event handler by key
   * can be useful for backing up event handlers after removal and restoring
   */
  public getEventListener(
    eventName: keyof EventHandlerMap,
    eventListenerKey: string,
  ) {
    return this.registeredEventHandlers[eventName].get(eventListenerKey)
  }

  private findNearestNodeIndex = (event: MouseEvent): number | null => {
    const rect = this.canvas.getBoundingClientRect()

    this.mouse.x = THREE.MathUtils.mapLinear(
      event.clientX - rect.left,
      0,
      rect.width,
      -1,
      1,
    )
    this.mouse.y = THREE.MathUtils.mapLinear(
      event.clientY - rect.top,
      0,
      rect.height,
      1,
      -1,
    )

    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObject(
      this.nodesMesh.object,
      true,
    )
    let nearestIndex = null
    if (intersects.length > 0) {
      const validNearestIntersects = orderBy(
        intersects,
        'distanceToRay',
        'asc',
      ).filter(
        (point: Intersection) =>
          !get(this.nodesData, `${point.index}.disableInteractions`),
      )

      if (
        validNearestIntersects.length > 0 &&
        validNearestIntersects[0].index !== undefined
      ) {
        nearestIndex = validNearestIntersects[0].index
      }
    }
    return nearestIndex
  }

  private onMouseDown = (event: MouseEvent) => {
    event.preventDefault()
    this.dragging = true
    this.registerClick = true
    this.intersectedPointIdx = this.findNearestNodeIndex(event)

    setTimeout(() => {
      this.registerClick = false
    }, MAX_CLICK_DURATION)

    this.panStart.set(event.clientX, event.clientY, 0)

    const worldMouse = this.getMouseInWorldSpace(2)
    this.frustum.start = worldMouse

    this.registeredEventHandlers.dragStart.forEach(onDragStart => {
      onDragStart(event, this.intersectedPointIdx, worldMouse)
    })
  }

  private onMouseUp = (event: MouseEvent) => {
    event.preventDefault()
    this.dragging = false
    const worldMouse = this.getMouseInWorldSpace(2)

    this.intersectedPointIdx = this.findNearestNodeIndex(event)

    this.frustum.end = worldMouse
    if (this.dragMode === 'select') {
      this.registeredEventHandlers.dragSelect.forEach(dragSelectListener =>
        dragSelectListener(event, worldMouse, this.findInFrustum()),
      )
    }

    this.registeredEventHandlers.dragEnd.forEach(dragEndListener => {
      dragEndListener(event, this.intersectedPointIdx, worldMouse)
    })

    if (this.registerClick) {
      this.registeredEventHandlers.click.forEach(clickListener => {
        clickListener(event, this.intersectedPointIdx, worldMouse)
      })
    }
  }

  // should we debounced this on requestAnimationFrame?
  private onMouseMove = (event: MouseEvent) => {
    event.preventDefault()
    const nearestIndex = this.findNearestNodeIndex(event)

    // handle hovers if not dragging
    if (!this.dragging) {
      // if a nearest intersection is found, fire node hover in/out events
      if (nearestIndex !== null) {
        if (this.intersectedPointIdx !== nearestIndex) {
          // hover in newly intersected node
          this.registeredEventHandlers.nodeHoverIn.forEach(onHoverIn => {
            onHoverIn(nearestIndex)
          })

          if (this.intersectedPointIdx !== null) {
            // hover out any previously intersected node
            const idx = this.intersectedPointIdx
            this.registeredEventHandlers.nodeHoverOut.forEach(onHoverOut => {
              onHoverOut(idx)
            })
          }
          this.intersectedPointIdx = nearestIndex
        }
      } else if (this.intersectedPointIdx !== null) {
        // hover out previously intersected node and set current intersection to null
        const idx = this.intersectedPointIdx
        this.registeredEventHandlers.nodeHoverOut.forEach(onHoverOut => {
          onHoverOut(idx)
        })
        this.intersectedPointIdx = null
      }
    } else if (this.intersectedPointIdx !== null) {
      // handle node drag interaction
      const idx = this.intersectedPointIdx
      this.registeredEventHandlers.nodeDrag.forEach(onDrag => {
        onDrag(event, this.getMouseInWorldSpace(0), idx)
      })
    } else {
      // calculate the pan delta
      this.panEnd.set(event.clientX, event.clientY, 0)
      this.panDelta.subVectors(this.panEnd, this.panStart)

      this.registeredEventHandlers.pan.forEach(onPan => {
        onPan(event, this.getMouseInWorldSpace(0), this.panDelta)
      })

      this.panStart.copy(this.panEnd)
    }
  }

  private onMouseWheel = (event: WheelEvent) => {
    event.preventDefault()
    event.stopPropagation()
    this.registeredEventHandlers.zoom.forEach(onZoom => {
      onZoom(event)
    })
  }

  private getMouseInWorldSpace = (z: number) => {
    const worldSpaceMouse = new THREE.Vector3(this.mouse.x, this.mouse.y, 0)
    worldSpaceMouse.unproject(this.camera)
    worldSpaceMouse.setZ(z)
    return worldSpaceMouse
  }

  private onContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    this.dragging = false
    this.intersectedPointIdx = this.findNearestNodeIndex(event)

    this.registeredEventHandlers.secondaryClick.forEach(onSecondaryClick => {
      onSecondaryClick(event, this.intersectedPointIdx)
    })
  }

  // finds node ids within the 2D selection frustum
  findInFrustum = () => {
    const posAttr = (this.nodesMesh.object
      .geometry as BufferGeometry).getAttribute('position')
    const hits: number[] = []
    for (let i = 0; i < posAttr.count; i++) {
      const left = Math.min(this.frustum.start.x, this.frustum.end.x)
      const right = Math.max(this.frustum.start.x, this.frustum.end.x)
      const top = Math.min(this.frustum.start.y, this.frustum.end.y)
      const down = Math.max(this.frustum.start.y, this.frustum.end.y)

      const point = new Vector3(
        posAttr.getX(i),
        posAttr.getY(i),
        posAttr.getZ(i),
      )
      if (
        point.x >= left &&
        point.x <= right &&
        point.y >= top &&
        point.y <= down
      ) {
        hits.push(i)
      }
    }
    return hits
  }
}
