import {orderBy} from 'lodash'
import * as THREE from 'three'
import {Nodes} from './Nodes'

const MAX_CLICK_DURATION = 300
const PAN_SPEED = 1.0
const MAX_ZOOM = 5.0

export class MouseInteraction {
  public onHover: (hoveredToNodeIdx: number|null, hoveredFromNodeIdx: number|null) => void
  public onClick: (mouse: THREE.Vector3, clickedNodeIdx: number|null) => void
  public onDragStart?: (mouse: THREE.Vector3, draggedNodeIdx: number|null) => void
  public onDrag: (mouse: THREE.Vector3, draggedNode: number) => void
  public onDragEnd: () => void
  public onPan: (panDelta: THREE.Vector3) => void
  public onZoom: (event: MouseWheelEvent) => void

  private nodes: Nodes
  private intersectedPointIdx: number|null
  private dragging: boolean
  private registerClick: boolean

  private readonly canvas: HTMLCanvasElement
  private readonly camera: THREE.OrthographicCamera
  private readonly panStart: THREE.Vector3
  private readonly panEnd: THREE.Vector3
  private readonly panDelta: THREE.Vector3
  private readonly mouse: THREE.Vector2
  private readonly raycaster: THREE.Raycaster

  constructor(canvas: HTMLCanvasElement, camera: THREE.OrthographicCamera, nodes: Nodes) {
    this.canvas = canvas
    this.camera = camera
    this.nodes = nodes

    this.intersectedPointIdx = null
    this.dragging = false
    this.registerClick = false

    this.panStart = new THREE.Vector3()
    this.panEnd = new THREE.Vector3()
    this.panDelta = new THREE.Vector3()

    this.mouse = new THREE.Vector2(0, 0)
    this.raycaster = new THREE.Raycaster()
    this.raycaster.params.Points!.threshold = 40

    this.canvas.addEventListener('mousedown', this.onMouseDown)
    this.canvas.addEventListener('mousemove', this.onMouseMove)
    this.canvas.addEventListener('mouseup', this.onMouseUp)
    this.canvas.addEventListener('wheel', this.onMouseWheel)
  }

  private onMouseDown = (event: MouseEvent) => {
    event.preventDefault()
    this.dragging = true
    this.registerClick = true

    setTimeout(() => {
      this.registerClick = false
    }, MAX_CLICK_DURATION)

    this.panStart.set(event.clientX, event.clientY, 0)
    if (this.onDragStart) {
      this.onDragStart(this.getMouseInWorldSpace(0), this.intersectedPointIdx)
    }
  }

  private onMouseUp = (event: MouseEvent) => {
    event.preventDefault()
    this.dragging = false
    if (this.onDragEnd) {
      this.onDragEnd()
    }

    if (this.registerClick && this.onClick) {
      this.onClick(this.getMouseInWorldSpace(0), this.intersectedPointIdx)
    }
  }

  // should we debounced this on requestAnimationFrame?
  private onMouseMove = (event: MouseEvent) => {
    event.preventDefault()

    const rect = this.canvas.getBoundingClientRect()

    this.mouse.x = THREE.Math.mapLinear(event.clientX - rect.left, 0, rect.width, -1, 1)
    this.mouse.y = THREE.Math.mapLinear(event.clientY - rect.top, 0, rect.height, 1, -1)

    // handle hovers if not dragging
    if (!this.dragging) {
      this.raycaster.setFromCamera(this.mouse, this.camera)

      const intersects = this.raycaster.intersectObject(this.nodes.object, true)

      if (intersects.length > 0) {
        // hover in
        const nearestIntersect = orderBy(intersects, 'distanceToRay', 'asc')[0]
        const nearestIndex = nearestIntersect.index || null
        if (this.intersectedPointIdx !== nearestIndex) {
          if (this.onHover) {
            this.onHover(nearestIndex, this.intersectedPointIdx)
          }
          this.intersectedPointIdx = nearestIndex
        }
      } else if (this.intersectedPointIdx !== null) {
        // hover out
        if (this.onHover) {
          this.onHover(null, this.intersectedPointIdx)
        }
        this.intersectedPointIdx = null
      }
    } else if (this.intersectedPointIdx !== null) {
      // handle node drag interaction

      if (this.onDrag) {
        this.onDrag(this.getMouseInWorldSpace(0), this.intersectedPointIdx)
      }
    } else {
      // pan camera on drag
      this.panEnd.set(event.clientX, event.clientY, 0)
      this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(PAN_SPEED)

      this.camera.position.x -= this.panDelta.x * (this.camera.right - this.camera.left) / this.camera.zoom / rect.width
      this.camera.position.y +=
        this.panDelta.y * (this.camera.top - this.camera.bottom) / this.camera.zoom / rect.height
      this.camera.updateProjectionMatrix()

      if (this.onPan) {
        this.onPan(this.panDelta)
      }

      this.panStart.copy(this.panEnd)
    }
  }

  private onMouseWheel = (event: MouseWheelEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const zoomFactor = event.deltaY < 0 ? 0.95 : 1.05
    this.camera.zoom = Math.min(MAX_ZOOM, this.camera.zoom * zoomFactor)
    this.camera.updateProjectionMatrix()

    if (this.onZoom) {
      this.onZoom(event)
    }
  }

  private getMouseInWorldSpace = (z: number) => {
    const worldSpaceMouse = new THREE.Vector3(this.mouse.x, this.mouse.y, z)
    worldSpaceMouse.unproject(this.camera)
    return worldSpaceMouse
  }
}
