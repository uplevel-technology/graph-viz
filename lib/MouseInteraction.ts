import {noop, orderBy} from 'lodash'
import * as THREE from 'three'
import {Nodes} from './Nodes'

const MAX_CLICK_DURATION = 300

/**
 * dispatched when a node is hovered in or out
 */
export type HoverEventHandler = (hoveredIdx: number) => any

/**
 * dispatched when the canvas is clicked. if a node click is detected the clickedNodeIdx will be non-null
 */
export type ClickEventHandler = (
  worldSpaceMousePosition: THREE.Vector3,
  clickedNodeIdx: number | null,
) => any

/**
 * dispatched when a mouse drag start is detected anywhere on the canvas
 */
export type DragStartEventHandler = (
  worldSpaceMousePosition: THREE.Vector3,
  draggedNodeIdx: number | null,
) => any

/**
 * dispatched when a mouse drag end is detected anywhere on the canvas
 */
export type DragEndEventHandler = (
  worldSpaceMousePosition: THREE.Vector3,
  draggedNodeIdx: number | null,
) => any

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
export type ZoomEventHandler = (event: MouseWheelEvent) => any

export class MouseInteraction {
  private nodes: Nodes
  private intersectedPointIdx: number | null
  private dragging: boolean
  private registerClick: boolean
  private registeredEventHandlers: {
    click: ClickEventHandler
    nodeHoverIn: HoverEventHandler
    nodeHoverOut: HoverEventHandler
    dragStart: DragStartEventHandler
    dragEnd: DragEndEventHandler
    nodeDrag: NodeDragEventHandler
    pan: PanEventHandler
    zoom: ZoomEventHandler
  } = {
    click: noop,
    nodeHoverIn: noop,
    nodeHoverOut: noop,
    dragStart: noop,
    dragEnd: noop,
    nodeDrag: noop,
    pan: noop,
    zoom: noop,
  }

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
    nodes: Nodes,
  ) {
    this.canvas = canvas
    this.camera = camera
    this.nodes = nodes

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
  }

  public onNodeHoverIn(callback: HoverEventHandler) {
    this.registeredEventHandlers.nodeHoverIn = callback
  }

  public onNodeHoverOut(callback: HoverEventHandler) {
    this.registeredEventHandlers.nodeHoverOut = callback
  }

  public onClick(callback: ClickEventHandler) {
    this.registeredEventHandlers.click = callback
  }

  public onDragStart(callback: DragStartEventHandler) {
    this.registeredEventHandlers.dragStart = callback
  }

  public onNodeDrag(callback: NodeDragEventHandler) {
    this.registeredEventHandlers.nodeDrag = callback
  }

  public onDragEnd(callback: DragEndEventHandler) {
    this.registeredEventHandlers.dragEnd = callback
  }

  public onPan(callback: PanEventHandler) {
    this.registeredEventHandlers.pan = callback
  }

  public onZoom(callback: ZoomEventHandler) {
    this.registeredEventHandlers.zoom = callback
  }

  private onMouseDown = (event: MouseEvent) => {
    event.preventDefault()
    this.dragging = true
    this.registerClick = true

    setTimeout(() => {
      this.registerClick = false
    }, MAX_CLICK_DURATION)

    this.panStart.set(event.clientX, event.clientY, 0)
    this.registeredEventHandlers.dragStart(
      this.getMouseInWorldSpace(0),
      this.intersectedPointIdx,
    )
  }

  private onMouseUp = (event: MouseEvent) => {
    event.preventDefault()
    this.dragging = false
    const worldMouse = this.getMouseInWorldSpace(0)
    this.registeredEventHandlers.dragEnd(worldMouse, this.intersectedPointIdx)

    if (this.registerClick) {
      this.registeredEventHandlers.click(worldMouse, this.intersectedPointIdx)
    }
  }

  // should we debounced this on requestAnimationFrame?
  private onMouseMove = (event: MouseEvent) => {
    event.preventDefault()

    const rect = this.canvas.getBoundingClientRect()

    this.mouse.x = THREE.Math.mapLinear(
      event.clientX - rect.left,
      0,
      rect.width,
      -1,
      1,
    )
    this.mouse.y = THREE.Math.mapLinear(
      event.clientY - rect.top,
      0,
      rect.height,
      1,
      -1,
    )

    // handle hovers if not dragging
    if (!this.dragging) {
      this.raycaster.setFromCamera(this.mouse, this.camera)

      const intersects = this.raycaster.intersectObject(this.nodes.object, true)

      if (intersects.length > 0) {
        // hover in
        const nearestIntersect = orderBy(intersects, 'distanceToRay', 'asc')[0]
        const nearestIndex =
          nearestIntersect.index === undefined ? null : nearestIntersect.index
        if (this.intersectedPointIdx !== nearestIndex) {
          if (nearestIndex != null) {
            this.registeredEventHandlers.nodeHoverIn(nearestIndex)
          }
          if (this.intersectedPointIdx !== null) {
            this.registeredEventHandlers.nodeHoverOut(this.intersectedPointIdx)
          }
          this.intersectedPointIdx = nearestIndex
        }
      } else if (this.intersectedPointIdx !== null) {
        this.registeredEventHandlers.nodeHoverOut(this.intersectedPointIdx)
        this.intersectedPointIdx = null
      }
    } else if (this.intersectedPointIdx !== null) {
      // handle node drag interaction
      this.registeredEventHandlers.nodeDrag(
        this.getMouseInWorldSpace(0),
        this.intersectedPointIdx,
      )
    } else {
      // calculate the pan delta
      this.panEnd.set(event.clientX, event.clientY, 0)
      this.panDelta.subVectors(this.panEnd, this.panStart)

      this.registeredEventHandlers.pan(this.panDelta)

      this.panStart.copy(this.panEnd)
    }
  }

  private onMouseWheel = (event: MouseWheelEvent) => {
    event.preventDefault()
    event.stopPropagation()
    this.registeredEventHandlers.zoom(event)
  }

  private getMouseInWorldSpace = (z: number) => {
    const worldSpaceMouse = new THREE.Vector3(this.mouse.x, this.mouse.y, z)
    worldSpaceMouse.unproject(this.camera)
    return worldSpaceMouse
  }
}
