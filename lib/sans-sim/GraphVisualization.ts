import {get, size} from 'lodash'
import * as THREE from 'three'
import {ForceSimulation} from './ForceSimulation'
import {Links} from './Links'
import {MouseInteraction} from './MouseInteraction'
import {Nodes} from './Nodes'

export interface VisualGraphNode {
  id: string
  displayName?: string
  inactive?: boolean
  fill?: number | string
  stroke?: number | string
  strokeOpacity?: number
  strokeWidth?: number
  [key: string]: any
}

export interface VisualGraphLink {
  source: VisualGraphNode
  target: VisualGraphNode
}

export interface VisualGraphData {
  nodes: VisualGraphNode[]
  links: VisualGraphLink[]
}

export class GraphVisualization {
  public graph: VisualGraphData
  public nodesMesh: Nodes
  public linksMesh: Links

  public onNodeClick: (clickedNode: VisualGraphNode) => {}
  public onHover: (hoveredNode: VisualGraphNode | null) => void

  private userHasAdjustedViewport: boolean
  private simulation: ForceSimulation
  private readonly camera: THREE.OrthographicCamera
  private readonly scene: THREE.Scene
  private readonly renderer: THREE.WebGLRenderer
  private readonly mouseInteraction: MouseInteraction
  private readonly canvas: HTMLCanvasElement

  constructor(graphData: VisualGraphData, canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas
    this.simulation = new ForceSimulation(graphData, this.onSimulationTick)
    this.graph = this.simulation.getVisualGraph()

    // init Scene and Camera
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(width * -0.5, width * 0.5, height * 0.5, height * -0.5, 1, 10000)

    // setup basic looks
    this.scene.add(this.camera)
    this.camera.position.z = 1000

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: this.canvas,
      // @see https://threejs.org/docs/#api/renderers/WebGLRenderer for all options
    })

    this.renderer.setClearColor(0x000000, 0)

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)

    this.nodesMesh = new Nodes(this.graph.nodes, this.camera)
    this.linksMesh = new Links(this.graph.links)

    this.scene.add(this.linksMesh.object)
    this.nodesMesh.object.position.z = 3
    this.scene.add(this.nodesMesh.object)

    this.render()

    this.mouseInteraction = new MouseInteraction(this.canvas, this.camera, this.nodesMesh)
    this.mouseInteraction.onClick = this.handleClick
    this.mouseInteraction.onHover = this.handleHover
    this.mouseInteraction.onDragStart = this.handleDragStart
    this.mouseInteraction.onDrag = this.handleDrag
    this.mouseInteraction.onDragEnd = this.handleDragEnd
    this.mouseInteraction.onPan = this.handlePan
    this.mouseInteraction.onZoom = this.handleZoomOnWheel
  }

  public render = () => {
    this.renderer.render(this.scene, this.camera)
  }

  private onSimulationTick = (updatedGraphData: VisualGraphData) => window.requestAnimationFrame(() => {
    this.nodesMesh.updatePositions(updatedGraphData.nodes)
    this.linksMesh.updatePositions(updatedGraphData.links)

    if (!this.userHasAdjustedViewport) {
      this.zoomToFit()
    }
    this.render()
  })

  public zoomToFit = () => {
    if (size(this.graph.nodes) === 0) {
      // Don't try to do this if there are no nodes.
      return
    }

    let boundingBox = new THREE.Box3().setFromObject(this.nodesMesh.object)
    boundingBox.expandByScalar(40 / this.camera.zoom) // pretend it's bigger, to get some padding

    const center = new THREE.Vector3()
    boundingBox.getCenter(center)
    this.camera.position.x = center.x
    this.camera.position.y = center.y

    let visibleBox = new THREE.Box3(new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, 1, 0))
    // Translate from "normalized device coordinates" to "world space" (the same
    // coordinate space as boundingBox):
    visibleBox.min.unproject(this.camera)
    visibleBox.max.unproject(this.camera)

    // Downgrade to 2D boxes:
    // @ts-ignore TODO explicitly downgrade to Box2
    boundingBox = new THREE.Box2().copy(boundingBox)
    // @ts-ignore TODO explicitly downgrade to Box2
    visibleBox = new THREE.Box2().copy(visibleBox)

    if (visibleBox.equals(boundingBox)) {
      return
    }

    const maxZoom = 2.0
    const scale = visibleBox.getSize(new THREE.Vector3()).divide(boundingBox.getSize(new THREE.Vector3()))
    this.camera.zoom = Math.min(maxZoom, this.camera.zoom * Math.min(scale.x, scale.y))
    this.camera.updateProjectionMatrix()
    this.nodesMesh.handleCameraZoom()
  }

  public update = (graphData: VisualGraphData) => {
    if (size(this.graph.nodes) === 0 && size(graphData.nodes) > 0) {
      // Re-initialize simulation if it's the first load for better stabilization
      this.simulation = new ForceSimulation(graphData, this.onSimulationTick)
    } else {
      this.simulation.update(graphData)
    }

    this.graph = this.simulation.getVisualGraph()

    this.nodesMesh.redraw(this.graph.nodes)
    this.linksMesh.redraw(this.graph.links)

    this.simulation.restart()
  }

  public dispose() {
    this.nodesMesh.dispose()
    this.linksMesh.dispose()
    this.renderer.dispose()
  }

  private handleHover = (hoveredToNodeIdx: number | null, hoveredFromNodeIdx: number | null) => {
    if (hoveredFromNodeIdx !== null) {
      this.nodesMesh.scalePointAt(hoveredFromNodeIdx, 1.0) // reset previously hovered
    }
    if (hoveredToNodeIdx !== null) {
      this.nodesMesh.scalePointAt(hoveredToNodeIdx, 1.75)
    }
    this.render()

    if (!this.onHover) {
      return
    }

    let node: VisualGraphNode | null = null
    if (hoveredToNodeIdx !== null && size(this.graph.nodes) > hoveredToNodeIdx) {
      node = this.graph.nodes[hoveredToNodeIdx]
    }
    this.onHover(node)
  }

  private handleDragStart = (mouse: THREE.Vector3, draggedNodeIdx: number | null) => {
    this.userHasAdjustedViewport = true
    if (draggedNodeIdx !== null) {
      this.simulation.restart()
    }
  }

  private handleDrag = (mouse: THREE.Vector3, draggedNodeIdx: number) => {
    // lock node
    const nodes = this.graph.nodes
    nodes[draggedNodeIdx].fx = mouse.x
    nodes[draggedNodeIdx].fy = mouse.y
    this.nodesMesh.lockPointAt(draggedNodeIdx)
    this.render()
  }

  private handleDragEnd = () => {
    this.simulation.stop()
  }

  private handlePan = () => {
    this.userHasAdjustedViewport = true
    this.render()
  }

  private handleZoomOnWheel = () => {
    this.userHasAdjustedViewport = true
    this.nodesMesh.handleCameraZoom()
    this.render()
  }

  private zoom = (factor: number) => {
    this.userHasAdjustedViewport = true
    this.camera.zoom += factor * this.camera.zoom
    this.camera.updateProjectionMatrix()
    this.nodesMesh.handleCameraZoom()
    this.render()
  }

  private handleClick = (mouse: THREE.Vector3, clickedNodeIdx: number | null) => {
    if (clickedNodeIdx !== null) {
      const nodes = this.graph.nodes
      if (get(nodes, `${clickedNodeIdx}.fx`)) {
        // release node
        nodes[clickedNodeIdx].fx = null
        nodes[clickedNodeIdx].fy = null
        this.nodesMesh.unlockPointAt(clickedNodeIdx)
      } else {
        nodes[clickedNodeIdx].fx = mouse.x
        nodes[clickedNodeIdx].fy = mouse.y
        this.nodesMesh.lockPointAt(clickedNodeIdx)
      }

      if (this.onNodeClick) {
        this.onNodeClick(nodes[clickedNodeIdx])
      }

      this.render()
    }
  }
}
