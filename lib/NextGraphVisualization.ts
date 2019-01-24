import {size} from 'lodash'
import * as THREE from 'three'
import {Vector3} from 'three'
import {getPopulatedGraphLinks, GraphVizLink, NextLinks} from './NextLinks'
import {
  ClickEventHandler,
  DragEndEventHandler,
  DragStartEventHandler,
  HoverEventHandler,
  NextMouseInteraction,
  NodeDragEventHandler,
  PanEventHandler,
  ZoomEventHandler,
} from './NextMouseInteraction'
import {GraphVizNode, NextNodes} from './NextNodes'

export interface GraphVizData {
  nodes: GraphVizNode[]
  links: GraphVizLink[]
}

function constructIdToIdxMap(arr: Array<{id: string}>): {[id: string]: number} {
  const map: {[id: string]: number} = {}
  arr.forEach((elem, idx) => {
    map[elem.id] = idx
  })

  return map
}

export class NextGraphVisualization {
  public nodesMesh: NextNodes
  public linksMesh: NextLinks

  public readonly canvas: HTMLCanvasElement
  public readonly camera: THREE.OrthographicCamera

  private graphData: GraphVizData
  private nodeIdToIndexMap: {[key: string]: number} = {}
  private userHasAdjustedViewport: boolean

  private registeredEventHandlers: {
    click?: ClickEventHandler,
    nodeHoverIn?: HoverEventHandler,
    nodeHoverOut?: HoverEventHandler,
    dragStart?: DragStartEventHandler,
    dragEnd?: DragEndEventHandler,
    nodeDrag?: NodeDragEventHandler,
    pan?: PanEventHandler,
    zoom?: ZoomEventHandler,
  } = {}

  private readonly scene: THREE.Scene
  private readonly renderer: THREE.WebGLRenderer
  private readonly mouseInteraction: NextMouseInteraction
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
    //   this.simulation.initialize(vizData)
    // }

    this.graphData = graphData
    this.nodeIdToIndexMap = constructIdToIdxMap(graphData.nodes)

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

    this.nodesMesh = new NextNodes(graphData.nodes)
    this.linksMesh = new NextLinks(getPopulatedGraphLinks(graphData, this.nodeIdToIndexMap))

    this.scene.add(this.linksMesh.object)
    this.nodesMesh.object.position.z = 3
    this.scene.add(this.nodesMesh.object)

    this.render()

    this.mouseInteraction = new NextMouseInteraction(this.canvas, this.camera, this.nodesMesh)
    this.mouseInteraction.onClick(this.handleClick)
    this.mouseInteraction.onNodeHoverIn(this.handleHoverIn)
    this.mouseInteraction.onNodeHoverOut(this.handleHoverOut)
    this.mouseInteraction.onDragStart(this.handleDragStart)
    this.mouseInteraction.onDragEnd(this.handleDragEnd)
    this.mouseInteraction.onNodeDrag(this.handleNodeDrag)
    this.mouseInteraction.onPan(this.handlePan)
    this.mouseInteraction.onZoom(this.handleZoomOnWheel)
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

  public onDragEnd(callback: DragEndEventHandler) {
    this.registeredEventHandlers.dragEnd = callback
  }

  public onNodeDrag(callback: NodeDragEventHandler) {
    this.registeredEventHandlers.nodeDrag = callback
  }

  public onPan(callback: PanEventHandler) {
    this.registeredEventHandlers.pan = callback
  }

  public onZoom(callback: ZoomEventHandler) {
    this.registeredEventHandlers.zoom = callback
  }

  public render = () => {
    this.renderer.render(this.scene, this.camera)
  }

  private updatePositions = (updatedGraphData: GraphVizData) => window.requestAnimationFrame(() => {
    this.graphData = updatedGraphData
    this.nodeIdToIndexMap = constructIdToIdxMap(updatedGraphData.nodes)

    this.nodesMesh.updatePositions(updatedGraphData.nodes)
    this.linksMesh.updatePositions(getPopulatedGraphLinks(updatedGraphData, this.nodeIdToIndexMap))

    if (!this.userHasAdjustedViewport) {
      this.zoomToFit(updatedGraphData)
    }
    this.render()
  })

  private zoomToFit = (graphData: GraphVizData) => {
    if (size(graphData.nodes) === 0) {
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
    this.graphData = graphData
    // if (size(this.vizData.nodes) === 0 && size(vizData.nodes) > 0) {
    //   // Re-initialize simulation if it's the first load for better stabilization
    //   this.simulation.initialize(vizData)
    // } else {
    //   this.simulation.update(vizData)
    // }

    // this.vizData = this.simulation.getVisualGraph()

    this.nodeIdToIndexMap = constructIdToIdxMap(graphData.nodes)

    this.nodesMesh.redraw(graphData.nodes)
    this.linksMesh.redraw(getPopulatedGraphLinks(graphData, this.nodeIdToIndexMap))

    // this.simulation.restart()
  }

  public updateNode = (nodeIdx: number) => {
    this.nodesMesh.redraw(this.graphData.nodes)
    // TODO optimize and redraw only one node:
    // this.nodesMesh.updateNodeAt(nodeIdx)
  }

  public toScreenSpacePoint = (worldX: number = 0, worldY: number = 0): THREE.Vector3 => {
    const pos = new THREE.Vector3(worldX, worldY, 0)
    pos.project(this.camera)

    return new THREE.Vector3(
      THREE.Math.mapLinear(pos.x, -1, 1, 0, this.width),
      THREE.Math.mapLinear(pos.y, 1, -1, 0, this.height),
      0,
    )
  }

  public zoom = (factor: number = 0) => {
    this.userHasAdjustedViewport = true
    this.camera.zoom += factor * this.camera.zoom
    this.camera.updateProjectionMatrix()
    this.nodesMesh.handleCameraZoom(this.camera.zoom)
    this.linksMesh.handleCameraZoom(this.camera.zoom)
    this.render()
  }

  public dispose() {
    this.nodesMesh.dispose()
    this.linksMesh.dispose()
    this.renderer.dispose()
  }

  private handleHoverIn = (hoveredToNodeIdx: number) => {
    if (!this.registeredEventHandlers.nodeHoverIn) {
      return
    }
    this.registeredEventHandlers.nodeHoverIn(hoveredToNodeIdx)
    this.render()
  }

  private handleHoverOut = (hoveredFromNodeIdx: number) => {
    if (hoveredFromNodeIdx !== null && this.registeredEventHandlers.nodeHoverOut) {
      this.registeredEventHandlers.nodeHoverOut(hoveredFromNodeIdx)
    }
    this.render()
  }

  private handleDragStart = (worldSpaceMouse: THREE.Vector3, draggedNodeIdx: number | null) => {
    this.userHasAdjustedViewport = true
    if (this.registeredEventHandlers.dragStart) {
      // if (draggedNodeIdx !== null) {
      //   this.simulation.reheat()
      // }
      this.registeredEventHandlers.dragStart(worldSpaceMouse, draggedNodeIdx)
    }
    this.render() // <- this is probably not needed
  }

  private handleNodeDrag = (worldSpaceMouse: THREE.Vector3, draggedNodeIdx: number) => {
    if (this.registeredEventHandlers.nodeDrag) {
      this.registeredEventHandlers.nodeDrag(worldSpaceMouse, draggedNodeIdx)
    }
    this.render()
  }

  private handleDragEnd = () => {
    if (this.registeredEventHandlers.dragEnd) {
      this.registeredEventHandlers.dragEnd()
    }
  }

  private handlePan = (panDelta: Vector3) => {
    this.userHasAdjustedViewport = true
    if (this.registeredEventHandlers.pan) {
      this.registeredEventHandlers.pan(panDelta)
    }
    this.render()
  }

  private handleZoomOnWheel = (event: MouseWheelEvent) => {
    this.userHasAdjustedViewport = true
    this.nodesMesh.handleCameraZoom(this.camera.zoom)
    this.linksMesh.handleCameraZoom(this.camera.zoom)
    if (this.registeredEventHandlers.zoom) {
      this.registeredEventHandlers.zoom(event)
    }
    this.render()
  }

  private handleClick = (worldSpaceMouse: THREE.Vector3, clickedNodeIdx: number | null) => {
    if (clickedNodeIdx === null || !this.registeredEventHandlers.click) {
      return
    }

    this.registeredEventHandlers.click(worldSpaceMouse, clickedNodeIdx)

    this.render()
  }
}
