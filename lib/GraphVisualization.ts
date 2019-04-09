import {size} from 'lodash'
import * as THREE from 'three'
import {Vector3} from 'three'
import {getPopulatedGraphLinks, GraphVizLink, Links} from './Links'
import {
  ClickEventHandler,
  DragEndEventHandler,
  DragStartEventHandler,
  HoverEventHandler,
  MouseInteraction,
  NodeDragEventHandler,
  PanEventHandler,
  ZoomEventHandler,
} from './MouseInteraction'
import {GraphVizNode, Nodes} from './Nodes'
import {Clusters, GraphVizCluster} from './Clusters'

const MAX_ZOOM = 5.0
const PAN_SPEED = 1.0

export interface GraphVizData {
  nodes: GraphVizNode[]
  links: GraphVizLink[]
  highlightedClusters: GraphVizCluster[]
}

function constructIdToIdxMap(arr: Array<{id: string}>): {[id: string]: number} {
  const map: {[id: string]: number} = {}
  arr.forEach((elem, idx) => {
    map[elem.id] = idx
  })

  return map
}

export interface ConfigurationOptions {
  disableClick?: boolean
  disableHover?: boolean
  disablePan?: boolean
  disableZoom?: boolean
  disableDrag?: boolean
}

const DEFAULT_CONFIG_OPTIONS: ConfigurationOptions = {
  disableClick: false,
  disableHover: false,
  disablePan: false,
  disableZoom: false,
  disableDrag: false,
}

export class GraphVisualization {
  public nodesMesh: Nodes
  public linksMesh: Links
  public clustersMesh: Clusters

  public readonly canvas: HTMLCanvasElement
  public readonly camera: THREE.OrthographicCamera

  private data: GraphVizData
  private nodeIdToIndexMap: {[key: string]: number} = {}
  private userHasAdjustedViewport: boolean

  private registeredEventHandlers: {
    click?: ClickEventHandler
    nodeHoverIn?: HoverEventHandler
    nodeHoverOut?: HoverEventHandler
    dragStart?: DragStartEventHandler
    dragEnd?: DragEndEventHandler
    nodeDrag?: NodeDragEventHandler
    pan?: PanEventHandler
    zoom?: ZoomEventHandler
  } = {}

  private width: number
  private height: number

  private readonly scene: THREE.Scene
  private readonly renderer: THREE.WebGLRenderer
  private readonly mouseInteraction: MouseInteraction

  constructor(
    graphData: GraphVizData,
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    config: ConfigurationOptions = {},
  ) {
    this.data = graphData
    this.canvas = canvas
    this.width = width
    this.height = height

    this.nodeIdToIndexMap = constructIdToIdxMap(graphData.nodes)

    // init Scene and Camera
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      1,
      10000,
    )

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

    this.nodesMesh = new Nodes(graphData.nodes)
    this.linksMesh = new Links(
      getPopulatedGraphLinks(graphData, this.nodeIdToIndexMap),
    )
    this.clustersMesh = new Clusters(
      graphData.nodes,
      graphData.highlightedClusters,
    )

    this.clustersMesh.object.position.z = 0
    this.scene.add(this.clustersMesh.object)

    this.linksMesh.object.position.z = 1
    this.scene.add(this.linksMesh.object)

    this.nodesMesh.object.position.z = 2
    this.scene.add(this.nodesMesh.object)

    this.render()

    this.mouseInteraction = new MouseInteraction(
      this.canvas,
      this.camera,
      this.nodesMesh,
      this.data.nodes,
    )

    const configWithDefault = {
      ...DEFAULT_CONFIG_OPTIONS,
      ...config,
    }

    if (!configWithDefault.disableClick) {
      this.mouseInteraction.onClick(this.handleClick)
    }

    if (!configWithDefault.disableHover) {
      this.mouseInteraction.onNodeHoverIn(this.handleHoverIn)
      this.mouseInteraction.onNodeHoverOut(this.handleHoverOut)
    }

    if (!configWithDefault.disableDrag) {
      this.mouseInteraction.onDragStart(this.handleDragStart)
      this.mouseInteraction.onDragEnd(this.handleDragEnd)
      this.mouseInteraction.onNodeDrag(this.handleNodeDrag)
    }

    if (!configWithDefault.disablePan) {
      this.mouseInteraction.onPan(this.handlePan)
    }

    if (!configWithDefault.disableZoom) {
      this.mouseInteraction.onZoom(this.handleZoomOnWheel)
    }
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

  /**
   * update or redraw all attributes of nodes and links
   * adds/removes new/deleted nodes
   * @param graphData
   */
  public update = (graphData: GraphVizData) => {
    this.data = graphData
    this.nodeIdToIndexMap = constructIdToIdxMap(graphData.nodes)
    this.nodesMesh.updateAll(graphData.nodes)
    this.linksMesh.updateAll(
      getPopulatedGraphLinks(graphData, this.nodeIdToIndexMap),
    )
    this.clustersMesh.updateAll(graphData.nodes, graphData.highlightedClusters)
    this.mouseInteraction.updateData(this.data.nodes)
  }

  /**
   * update only the position attributes of existing nodes and links.
   *
   * This function assumes that the nodeIdToIndexMap is up to date and
   * that the updatedGraphData hasn't changed in size or order
   * and only the position attributes have changed within each node datum.
   *
   * @param updatedGraphData
   */
  public updatePositions = (updatedGraphData: GraphVizData) =>
    window.requestAnimationFrame(() => {
      if (updatedGraphData.nodes.length !== this.data.nodes.length) {
        throw new Error(
          `GraphVisualization.updatePositions should only be used 
          when the size and the order of the nodes has not changed. 
          Currently rendered ${this.data.nodes.length} nodes.
          Received update for ${updatedGraphData.nodes.length} nodes.`,
        )
      }

      this.data = updatedGraphData

      this.nodesMesh.updateAllPositions(updatedGraphData.nodes)
      this.linksMesh.updateAllPositions(
        getPopulatedGraphLinks(updatedGraphData, this.nodeIdToIndexMap),
      )
      this.clustersMesh.updateAll(
        updatedGraphData.nodes,
        updatedGraphData.highlightedClusters,
      )
      this.mouseInteraction.updateData(this.data.nodes)

      if (!this.userHasAdjustedViewport) {
        this.zoomToFit(updatedGraphData)
      }
      this.render()
    })

  /**
   * update all the attributes of a single node at a given index
   * @param index
   * @param updatedNode
   */
  public updateNode = (index: number, updatedNode: GraphVizNode) => {
    this.data.nodes[index] = updatedNode
    this.nodesMesh.updateOne(index, updatedNode)
    this.mouseInteraction.updateData(this.data.nodes)
    this.clustersMesh.updateAll(this.data.nodes, this.data.highlightedClusters)
    this.render()
  }

  /**
   * updates only the clusters mesh.
   * Useful in situations that require ONLY clusters to update.
   * E.g. toggling a cluster on or off when the nodes within a cluster
   * have NOT changed.
   * @param clusters
   */
  public updateClusters = (clusters: GraphVizCluster[]) => {
    this.data.highlightedClusters = clusters
    this.clustersMesh.updateAll(this.data.nodes, this.data.highlightedClusters)
    this.render()
  }

  /**
   * resize the canvas
   * @param width
   * @param height
   */
  public resize(width: number, height: number) {
    if (width === this.width && height === this.height) {
      return
    }
    this.width = width
    this.height = height

    this.renderer.setSize(width, height)
    this.camera.left = -width / 2
    this.camera.right = width / 2
    this.camera.top = height / 2
    this.camera.bottom = -height / 2
    this.camera.updateProjectionMatrix()
    this.render()
  }

  /**
   * converts a world space coordinate to screen space
   * @param worldX
   * @param worldY
   */
  public toScreenSpacePoint = (
    worldX: number = 0,
    worldY: number = 0,
  ): THREE.Vector3 => {
    const pos = new THREE.Vector3(worldX, worldY, 0)
    pos.project(this.camera)

    return new THREE.Vector3(
      THREE.Math.mapLinear(pos.x, -1, 1, 0, this.width),
      THREE.Math.mapLinear(pos.y, 1, -1, 0, this.height),
      0,
    )
  }

  /**
   * public method to zoom the graph
   * @param factor
   */
  public zoom = (factor: number = 0) => {
    this.userHasAdjustedViewport = true
    this.camera.zoom += factor * this.camera.zoom
    this.camera.updateProjectionMatrix()
    this.nodesMesh.handleCameraZoom(this.camera.zoom)
    this.linksMesh.handleCameraZoom(this.camera.zoom)
    this.render()
  }

  /**
   * disposes the graph viz context
   */
  public dispose() {
    this.nodesMesh.dispose()
    this.linksMesh.dispose()
    this.renderer.dispose()
  }

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

    let visibleBox = new THREE.Box3(
      new THREE.Vector3(-1, -1, 0),
      new THREE.Vector3(1, 1, 0),
    )
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
    const scale = visibleBox
      .getSize(new THREE.Vector3())
      .divide(boundingBox.getSize(new THREE.Vector3()))
    this.camera.zoom = Math.min(
      maxZoom,
      this.camera.zoom * Math.min(scale.x, scale.y),
    )
    this.camera.updateProjectionMatrix()
    this.nodesMesh.handleCameraZoom(this.camera.zoom)
    this.linksMesh.handleCameraZoom(this.camera.zoom)
  }

  private handleHoverIn = (hoveredToNodeIdx: number) => {
    if (!this.registeredEventHandlers.nodeHoverIn) {
      return
    }
    this.registeredEventHandlers.nodeHoverIn(hoveredToNodeIdx)
    this.render()
  }

  private handleHoverOut = (hoveredFromNodeIdx: number) => {
    if (!this.registeredEventHandlers.nodeHoverOut) {
      return
    }
    this.registeredEventHandlers.nodeHoverOut(hoveredFromNodeIdx)
    this.render()
  }

  private handleDragStart = (
    worldSpaceMouse: THREE.Vector3,
    draggedNodeIdx: number | null,
  ) => {
    this.userHasAdjustedViewport = true
    if (this.registeredEventHandlers.dragStart) {
      this.registeredEventHandlers.dragStart(worldSpaceMouse, draggedNodeIdx)
    }
    this.render() // <- this is probably not needed
  }

  private handleNodeDrag = (
    worldSpaceMouse: THREE.Vector3,
    draggedNodeIdx: number,
  ) => {
    if (this.registeredEventHandlers.nodeDrag) {
      this.registeredEventHandlers.nodeDrag(worldSpaceMouse, draggedNodeIdx)
    }
    this.render()
  }

  private handleDragEnd = (worldSpaceMouse: THREE.Vector3, nodeIdx: number) => {
    if (this.registeredEventHandlers.dragEnd) {
      this.registeredEventHandlers.dragEnd(worldSpaceMouse, nodeIdx)
    }
  }

  private handlePan = (panDelta: Vector3) => {
    const rect = this.canvas.getBoundingClientRect()
    panDelta.multiplyScalar(PAN_SPEED)

    this.camera.position.x -=
      (panDelta.x * (this.camera.right - this.camera.left)) /
      this.camera.zoom /
      rect.width
    this.camera.position.y +=
      (panDelta.y * (this.camera.top - this.camera.bottom)) /
      this.camera.zoom /
      rect.height
    this.camera.updateProjectionMatrix()

    this.userHasAdjustedViewport = true

    if (this.registeredEventHandlers.pan) {
      this.registeredEventHandlers.pan(panDelta)
    }
    this.render()
  }

  private handleZoomOnWheel = (event: MouseWheelEvent) => {
    this.userHasAdjustedViewport = true

    const zoomFactor = event.deltaY < 0 ? 0.95 : 1.05
    this.camera.zoom = Math.min(MAX_ZOOM, this.camera.zoom * zoomFactor)
    this.camera.updateProjectionMatrix()

    this.nodesMesh.handleCameraZoom(this.camera.zoom)
    this.linksMesh.handleCameraZoom(this.camera.zoom)

    if (this.registeredEventHandlers.zoom) {
      this.registeredEventHandlers.zoom(event)
    }
    this.render()
  }

  private handleClick = (
    worldSpaceMouse: THREE.Vector3,
    clickedNodeIdx: number | null,
  ) => {
    if (clickedNodeIdx === null || !this.registeredEventHandlers.click) {
      return
    }

    this.registeredEventHandlers.click(worldSpaceMouse, clickedNodeIdx)
    this.render()
  }
}
