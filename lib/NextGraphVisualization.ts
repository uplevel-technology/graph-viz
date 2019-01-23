import {get, size, values} from 'lodash'
import * as THREE from 'three'
import {GraphVizLink, NextLinks, PopulatedGraphVizLink, getPopulatedGraphLinks} from './NextLinks'
import {NextMouseInteraction} from './NextMouseInteraction'
import {GraphVizNode, NextNodes} from './NextNodes'

export interface GraphVizData {
  nodes: GraphVizNode[]
  links: GraphVizLink[]
}

interface ScreenSpaceNode {
  id: string
  screenX: number
  screenY: number
}

type ClickEventHandler = (clickedNode: GraphVizNode) => void
type HoverEventHandler = (hoveredNode: ScreenSpaceNode) => void

export class NextGraphVisualization {
  public nodesMesh: NextNodes
  public linksMesh: NextLinks

  private nodeIdToIndexMap: {[key: string]: number} = {}
  private graphData: GraphVizData
  private nodesData: GraphVizNode[]
  private linksData: PopulatedGraphVizLink[]
  private userHasAdjustedViewport: boolean
  private registeredEventHandlers: {
    nodeClick?: ClickEventHandler,
    nodeHover?: HoverEventHandler,
  } = {}

  private readonly camera: THREE.OrthographicCamera
  private readonly scene: THREE.Scene
  private readonly renderer: THREE.WebGLRenderer
  private readonly mouseInteraction: NextMouseInteraction
  private readonly canvas: HTMLCanvasElement
  private readonly width: number
  private readonly height: number

  constructor(
    graphData: GraphVizData,
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
  ) {
    this.canvas = canvas
    this.width = width
    this.height = height
    //
    // if (simulation) {
    //   this.simulation = simulation
    // } else {
    //   this.simulation = new DefaultForceSimulation()
    //   this.simulation.onSimulationTick(this.updatePositions)
    //   this.simulation.initialize(graphData)
    // }

    this.graphData = graphData
    this.nodesData = values(graphData.nodes)

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

    this.nodesMesh = new NextNodes(this.nodesData)
    this.linksMesh = new NextLinks(getPopulatedGraphLinks(this.graphData))

    this.scene.add(this.linksMesh.object)
    this.nodesMesh.object.position.z = 3
    this.scene.add(this.nodesMesh.object)

    this.render()

    this.mouseInteraction = new NextMouseInteraction(this.canvas, this.camera, this.nodesMesh)
    this.mouseInteraction.onClick(this.handleClick)
    this.mouseInteraction.onHover(this.handleHover)
    this.mouseInteraction.onDragStart(this.handleDragStart)
    this.mouseInteraction.onDrag(this.handleDrag)
    this.mouseInteraction.onDragEnd(this.handleDragEnd)
    this.mouseInteraction.onPan(this.handlePan)
    this.mouseInteraction.onZoom(this.handleZoomOnWheel)
  }

  public onClick(callback: ClickEventHandler) {
    this.registeredEventHandlers.nodeClick = callback
  }

  public onHover(callback: HoverEventHandler) {
    this.registeredEventHandlers.nodeHover = callback
  }

  public render = () => {
    this.renderer.render(this.scene, this.camera)
  }

  private updatePositions = (updatedGraphData: GraphVizData) => window.requestAnimationFrame(() => {
    this.nodesMesh.updatePositions(values(updatedGraphData.nodes))
    this.linksMesh.updatePositions(getPopulatedGraphLinks(updatedGraphData))

    if (!this.userHasAdjustedViewport) {
      this.zoomToFit()
    }
    this.render()
  })

  private zoomToFit = () => {
    if (size(this.graphData.nodes) === 0) {
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
    this.nodesMesh.handleCameraZoom(this.camera.zoom)
    this.linksMesh.handleCameraZoom(this.camera.zoom)
  }

  public update = (graphData: GraphVizData) => {
    // if (size(this.graphData.nodes) === 0 && size(graphData.nodes) > 0) {
    //   // Re-initialize simulation if it's the first load for better stabilization
    //   this.simulation.initialize(graphData)
    // } else {
    //   this.simulation.update(graphData)
    // }

    // this.graphData = this.simulation.getVisualGraph()

    this.nodesMesh.redraw(values(this.graphData.nodes))
    this.linksMesh.redraw(getPopulatedGraphLinks(this.graphData))

    // this.simulation.restart()
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

    let screenNode: ScreenSpaceNode | null = null
    if (hoveredToNodeIdx !== null && size(this.graphData.nodes) > hoveredToNodeIdx) {
      const node = this.graphData.nodes[hoveredToNodeIdx]
      const pos = this.toScreenSpacePoint(node.x, node.y)
      screenNode = {
        ...node,
        screenX: pos.x,
        screenY: pos.y,
      }
    }
    this.onHover(screenNode)
  }

  private toScreenSpacePoint = (worldX: number = 0, worldY: number = 0): THREE.Vector3 => {
    const pos = new THREE.Vector3(worldX, worldY, 0)
    pos.project(this.camera)

    return new THREE.Vector3(
      THREE.Math.mapLinear(pos.x, -1, 1, 0, this.width),
      THREE.Math.mapLinear(pos.y, 1, -1, 0, this.height),
      0,
    )
  }

  private handleDragStart = (mouse: THREE.Vector3, draggedNodeIdx: number | null) => {
    this.userHasAdjustedViewport = true
    // if (draggedNodeIdx !== null) {
    //   this.simulation.reheat()
    // }
  }

  private handleDrag = (mouse: THREE.Vector3, draggedNodeIdx: number) => {
    // lock node
    const nodes = this.graphData.nodes
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
    this.nodesMesh.handleCameraZoom(this.camera.zoom)
    this.linksMesh.handleCameraZoom(this.camera.zoom)
    this.render()
  }

  private zoom = (factor: number) => {
    this.userHasAdjustedViewport = true
    this.camera.zoom += factor * this.camera.zoom
    this.camera.updateProjectionMatrix()
    this.nodesMesh.handleCameraZoom(this.camera.zoom)
    this.linksMesh.handleCameraZoom(this.camera.zoom)
    this.render()
  }

  private handleClick = (mouse: THREE.Vector3, clickedNodeIdx: number | null) => {
    if (clickedNodeIdx === null || !this.registeredEventHandlers.nodeClick) {
      return
    }

    const nodes = this.simulation.nodes //  this.graphData.nodes
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

    // if (this.onNodeClick) {
    //   this.onNodeClick(nodes[clickedNodeIdx])
    // }

    this.registeredEventHandlers.nodeClick(nodes[])

    this.render()
  }
}
