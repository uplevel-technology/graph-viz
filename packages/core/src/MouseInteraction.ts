import {get, orderBy} from 'lodash'
import * as THREE from 'three'
import {Intersection} from 'three'
import {DisplayNode, Nodes} from './Nodes'

const MAX_CLICK_DURATION = 300

type GenericMouseEventHandler = (
  worldSpacePosition: THREE.Vector3,
  nodeIdx: number | null,
  event: MouseEvent,
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
  worldSpaceMousePosition: THREE.Vector3,
  draggedNodeIdx: number,
) => any

/**
 * dispatched when a mouse dragging event is detected after dragStart was dispatched with a null node
 * i.e. canvas was panned
 */
export type PanEventHandler = (panDelta: THREE.Vector3) => any

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
  click: ClickEventHandler[]
  nodeHoverIn: HoverEventHandler[]
  nodeHoverOut: HoverEventHandler[]
  dragStart: DragStartEventHandler[]
  dragEnd: DragEndEventHandler[]
  nodeDrag: NodeDragEventHandler[]
  pan: PanEventHandler[]
  zoom: ZoomEventHandler[]
  secondaryClick: SecondaryClickEventHandler[]
}

export class MouseInteraction {
  private nodesData: DisplayNode[]
  private intersectedPointIdx: number | null
  private dragging: boolean
  private registerClick: boolean
  private registeredEventHandlers: EventHandlerMap = {
    click: [],
    nodeHoverIn: [],
    nodeHoverOut: [],
    dragStart: [],
    dragEnd: [],
    nodeDrag: [],
    pan: [],
    zoom: [],
    secondaryClick: [],
  }

  private readonly nodesMesh: Nodes
  private readonly canvas: HTMLCanvasElement
  private readonly camera: THREE.OrthographicCamera
  private readonly panStart: THREE.Vector3
  private readonly panEnd: THREE.Vector3
  private readonly panDelta: THREE.Vector3
  private readonly mouse: THREE.Vector2
  private readonly raycaster: THREE.Raycaster

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

  public addEventListener(eventName: 'click', callback: ClickEventHandler): void
  public addEventListener(
    eventName: 'nodeHoverIn',
    callback: HoverEventHandler,
  ): void
  public addEventListener(
    eventName: 'nodeHoverOut',
    callback: HoverEventHandler,
  ): void
  public addEventListener(
    eventName: 'dragStart',
    callback: DragStartEventHandler,
  ): void
  public addEventListener(
    eventName: 'dragEnd',
    callback: DragEndEventHandler,
  ): void
  public addEventListener(
    eventName: 'nodeDrag',
    callback: NodeDragEventHandler,
  ): void
  public addEventListener(eventName: 'pan', callback: PanEventHandler): void
  public addEventListener(eventName: 'zoom', callback: ZoomEventHandler): void
  public addEventListener(
    eventName: 'secondaryClick',
    callback: SecondaryClickEventHandler,
  ): void
  public addEventListener(eventName: keyof EventHandlerMap, callback: any) {
    this.registeredEventHandlers[eventName].push(callback)
  }

  /**
   * removes a registered event handler by reference
   */
  public removeEventListener(
    eventName: keyof EventHandlerMap,
    callbackRef: any,
  ) {
    ;(this.registeredEventHandlers[eventName] as any[]).filter(
      e => e !== callbackRef,
    )
  }

  /**
   * @deprecated use addEventListener or removeEventListener
   */
  public onNodeHoverIn(callback: HoverEventHandler) {
    this.registeredEventHandlers.nodeHoverIn = [callback]
  }

  /**
   * @deprecated use addEventListener or removeEventListener
   */
  public onNodeHoverOut(callback: HoverEventHandler) {
    this.registeredEventHandlers.nodeHoverOut = [callback]
  }

  /**
   * @deprecated use addEventListener or removeEventListener
   */
  public onClick(callback: ClickEventHandler) {
    this.registeredEventHandlers.click = [callback]
  }

  /**
   * @deprecated use addEventListener or removeEventListener
   */
  public onDragStart(callback: DragStartEventHandler) {
    this.registeredEventHandlers.dragStart = [callback]
  }

  /**
   * @deprecated use addEventListener or removeEventListener
   */
  public onNodeDrag(callback: NodeDragEventHandler) {
    this.registeredEventHandlers.nodeDrag = [callback]
  }

  /**
   * @deprecated use addEventListener or removeEventListener
   */
  public onDragEnd(callback: DragEndEventHandler) {
    this.registeredEventHandlers.dragEnd = [callback]
  }

  /**
   * @deprecated use addEventListener or removeEventListener
   */
  public onPan(callback: PanEventHandler) {
    this.registeredEventHandlers.pan = [callback]
  }

  /**
   * @deprecated use addEventListener or removeEventListener
   */
  public onZoom(callback: ZoomEventHandler) {
    this.registeredEventHandlers.zoom = [callback]
  }

  /**
   * @deprecated use addEventListener or removeEventListener
   */
  public onSecondaryClick(callback: SecondaryClickEventHandler) {
    this.registeredEventHandlers.secondaryClick = [callback]
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

    for (const listener of this.registeredEventHandlers.dragStart) {
      listener(this.getMouseInWorldSpace(0), this.intersectedPointIdx, event)
    }
  }

  private onMouseUp = (event: MouseEvent) => {
    event.preventDefault()
    this.dragging = false
    const worldMouse = this.getMouseInWorldSpace(0)

    this.intersectedPointIdx = this.findNearestNodeIndex(event)

    for (const dragEndListener of this.registeredEventHandlers.dragEnd) {
      dragEndListener(worldMouse, this.intersectedPointIdx, event)
    }

    if (this.registerClick) {
      for (const clickListener of this.registeredEventHandlers.click) {
        clickListener(worldMouse, this.intersectedPointIdx, event)
      }
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
          for (const onHoverIn of this.registeredEventHandlers.nodeHoverIn) {
            onHoverIn(nearestIndex)
          }

          if (this.intersectedPointIdx !== null) {
            // hover out any previously intersected node
            for (const onHoverOut of this.registeredEventHandlers
              .nodeHoverOut) {
              onHoverOut(this.intersectedPointIdx)
            }
          }
          this.intersectedPointIdx = nearestIndex
        }
      } else if (this.intersectedPointIdx !== null) {
        // hover out previously intersected node and set current intersection to null
        for (const onHoverOut of this.registeredEventHandlers.nodeHoverOut) {
          onHoverOut(this.intersectedPointIdx)
        }
        this.intersectedPointIdx = null
      }
    } else if (this.intersectedPointIdx !== null) {
      // handle node drag interaction
      for (const onDrag of this.registeredEventHandlers.nodeDrag) {
        onDrag(this.getMouseInWorldSpace(0), this.intersectedPointIdx)
      }
    } else {
      // calculate the pan delta
      this.panEnd.set(event.clientX, event.clientY, 0)
      this.panDelta.subVectors(this.panEnd, this.panStart)

      for (const onPan of this.registeredEventHandlers.pan) {
        onPan(this.panDelta)
      }

      this.panStart.copy(this.panEnd)
    }
  }

  private onMouseWheel = (event: WheelEvent) => {
    event.preventDefault()
    event.stopPropagation()
    for (const onZoom of this.registeredEventHandlers.zoom) {
      onZoom(event)
    }
  }

  private getMouseInWorldSpace = (z: number) => {
    const worldSpaceMouse = new THREE.Vector3(this.mouse.x, this.mouse.y, z)
    worldSpaceMouse.unproject(this.camera)
    return worldSpaceMouse
  }

  private onContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    this.dragging = false
    this.intersectedPointIdx = this.findNearestNodeIndex(event)

    for (const onSecondaryClick of this.registeredEventHandlers
      .secondaryClick) {
      onSecondaryClick(event, this.intersectedPointIdx)
    }
  }
}
