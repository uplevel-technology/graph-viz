import {defaultsDeep, isEqual, size} from 'lodash'
import * as THREE from 'three'
import {Vector3} from 'three'
import {
  DisplayLink,
  LINK_DEFAULTS,
  Links,
  LinkStyleAttributes,
  populateLinks,
} from './Links'
import {
  ClickEventHandler,
  DragEndEventHandler,
  DragStartEventHandler,
  HoverEventHandler,
  MouseInteraction,
  NodeDragEventHandler,
  PanEventHandler,
  SecondaryClickEventHandler,
  ZoomEventHandler,
} from './MouseInteraction'
import {DisplayNode, NODE_DEFAULTS, Nodes, NodeStyleAttributes} from './Nodes'
import {
  DisplayGroup,
  DisplayGroups,
  GROUP_DEFAULTS,
  GroupStyleAttributes,
} from './DisplayGroups'
import {
  required,
  validateArgs,
  validateClassConstructor,
  validateConfig,
  validateInputData,
} from './validators'
import Ajv from 'ajv'

const MAX_ZOOM = 5.0
const PAN_SPEED = 1.0

export interface VisualizationInputData {
  /**
   * list of nodes with their style and position attributes
   */
  nodes: DisplayNode[]

  /**
   * list of links
   */
  links: DisplayLink[]

  /**
   * list of groups
   */
  groups: DisplayGroup[]
}

function constructIdToIdxMap(arr: Array<{id: string}>): {[id: string]: number} {
  const map: {[id: string]: number} = {}
  arr.forEach((elem, idx) => {
    map[elem.id] = idx
  })

  return map
}

export interface ConfigurationOptions {
  /**
   * node style config
   */
  nodes?: NodeStyleAttributes

  /**
   * link style config
   */
  links?: LinkStyleAttributes

  /**
   * group style config
   */
  groups?: GroupStyleAttributes
}

const DEFAULT_CONFIG_OPTIONS: Required<ConfigurationOptions> = {
  nodes: NODE_DEFAULTS,
  links: LINK_DEFAULTS,
  groups: GROUP_DEFAULTS,
}

@validateClassConstructor
export class GraphVisualization {
  public nodesMesh: Nodes
  public linksMesh: Links
  public groupsMesh: DisplayGroups

  public readonly canvas: HTMLCanvasElement
  public readonly camera: THREE.OrthographicCamera

  private data: VisualizationInputData
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
    secondaryClick?: SecondaryClickEventHandler
  } = {}

  private width: number
  private height: number

  private readonly scene: THREE.Scene
  private readonly renderer: THREE.WebGLRenderer

  public readonly interaction: MouseInteraction
  private config: Required<ConfigurationOptions> = DEFAULT_CONFIG_OPTIONS

  constructor(
    @required graphData: VisualizationInputData,
    @required canvas: HTMLCanvasElement,
    @required width: number,
    @required height: number,
    config: ConfigurationOptions = DEFAULT_CONFIG_OPTIONS,
  ) {
    if (!validateInputData(graphData)) {
      const err = validateInputData.errors?.[0] as Ajv.ErrorObject
      throw new Error(`data${err.dataPath} ${err.message}`)
    }

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
    this.linksMesh = new Links(populateLinks(graphData, this.nodeIdToIndexMap))
    this.groupsMesh = new DisplayGroups(graphData.nodes, graphData.groups)

    this.groupsMesh.object.position.z = 0
    this.scene.add(this.groupsMesh.object)

    this.linksMesh.object.position.z = 1
    this.scene.add(this.linksMesh.object)

    this.nodesMesh.object.position.z = 2
    this.scene.add(this.nodesMesh.object)

    this.render()

    this.interaction = new MouseInteraction(
      this.canvas,
      this.camera,
      this.nodesMesh,
      this.data.nodes,
    )
    this.updateConfig(config)

    this.interaction.addEventListener('click', this.handleClick)
    this.interaction.addEventListener('nodeHoverIn', this.handleHoverIn)
    this.interaction.addEventListener('nodeHoverOut', this.handleHoverOut)
    this.interaction.addEventListener('dragStart', this.handleDragStart)
    this.interaction.addEventListener('dragEnd', this.handleDragEnd)
    this.interaction.addEventListener('nodeDrag', this.handleNodeDrag)
    this.interaction.addEventListener('pan', this.handlePan)
    this.interaction.addEventListener('zoom', this.handleZoomOnWheel)
    this.interaction.addEventListener(
      'secondaryClick',
      this.handleSecondaryClick,
    )
  }

  /**
   * update config and re-render
   * @param newConfig
   */
  public updateConfig(newConfig?: ConfigurationOptions) {
    if (!validateConfig(newConfig)) {
      const err = validateConfig.errors?.[0] as Ajv.ErrorObject
      throw new Error(`config${err.dataPath} ${err.message}`)
    }

    let needsUpdate = false
    if (!isEqual(newConfig?.nodes, this.config.nodes)) {
      this.nodesMesh.updateDefaults(newConfig?.nodes, this.data.nodes)
      needsUpdate = true
    }
    if (!isEqual(newConfig?.links, this.config.links)) {
      this.linksMesh.updateDefaults(
        newConfig?.links,
        populateLinks(this.data, this.nodeIdToIndexMap),
      )
      needsUpdate = true
    }
    if (!isEqual(newConfig?.groups, this.config.groups)) {
      this.groupsMesh.updateDefaults(
        newConfig?.groups,
        this.data.nodes,
        this.data.groups,
      )
      needsUpdate = true
    }

    this.config = defaultsDeep(
      {},
      newConfig,
      DEFAULT_CONFIG_OPTIONS, // reset undefined to default vals
      this.config, // preserve other values
    )

    if (needsUpdate) {
      this.render()
    }
  }

  @validateArgs
  public onNodeHoverIn(@required callback: HoverEventHandler) {
    this.registeredEventHandlers.nodeHoverIn = callback
  }

  @validateArgs
  public onNodeHoverOut(@required callback: HoverEventHandler) {
    this.registeredEventHandlers.nodeHoverOut = callback
  }

  @validateArgs
  public onClick(@required callback: ClickEventHandler) {
    this.registeredEventHandlers.click = callback
  }

  @validateArgs
  public onDragStart(@required callback: DragStartEventHandler) {
    this.registeredEventHandlers.dragStart = callback
  }

  @validateArgs
  public onDragEnd(@required callback: DragEndEventHandler) {
    this.registeredEventHandlers.dragEnd = callback
  }

  @validateArgs
  public onNodeDrag(@required callback: NodeDragEventHandler) {
    this.registeredEventHandlers.nodeDrag = callback
  }

  @validateArgs
  public onSecondaryClick(@required callback: SecondaryClickEventHandler) {
    this.registeredEventHandlers.secondaryClick = callback
  }

  @validateArgs
  public onPan(@required callback: PanEventHandler) {
    this.registeredEventHandlers.pan = callback
  }

  @validateArgs
  public onZoom(@required callback: ZoomEventHandler) {
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
  @validateArgs
  public update(@required graphData: VisualizationInputData) {
    if (!validateInputData(graphData)) {
      const err = validateInputData.errors?.[0] as Ajv.ErrorObject
      throw new Error(`data${err.dataPath} ${err.message}`)
    }

    this.data = graphData
    this.nodeIdToIndexMap = constructIdToIdxMap(graphData.nodes)
    this.nodesMesh.updateAll(graphData.nodes)
    this.linksMesh.updateAll(populateLinks(graphData, this.nodeIdToIndexMap))
    this.groupsMesh.updateAll(graphData.nodes, graphData.groups)
    this.interaction.updateData(this.data.nodes)
    this.render()
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
  @validateArgs
  public updatePositions(@required updatedGraphData: VisualizationInputData) {
    if (updatedGraphData.nodes.length !== this.data.nodes.length) {
      throw new Error(
        `GraphVisualization.updatePositions should only be used 
          when the size and the order of the nodes has not changed.
          Use update() to resize the data.
          
          Currently rendered ${this.data.nodes.length} nodes.
          Received update for ${updatedGraphData.nodes.length} nodes.`,
      )
    }
    if (updatedGraphData.links.length !== this.data.links.length) {
      throw new Error(
        `GraphVisualization.updatePositions should only be used 
          when the size and the order of the links has not changed.
          Use update() to resize the data.
          
          Currently rendered ${this.data.links.length} links.
          Received update for ${updatedGraphData.links.length} links.`,
      )
    }

    this.data = updatedGraphData

    this.nodesMesh.updateAllPositions(updatedGraphData.nodes)
    this.linksMesh.updateAllPositions(
      populateLinks(updatedGraphData, this.nodeIdToIndexMap),
    )
    this.groupsMesh.updateAll(updatedGraphData.nodes, updatedGraphData.groups)
    this.interaction.updateData(this.data.nodes)

    if (!this.userHasAdjustedViewport) {
      this.zoomToFit(updatedGraphData)
    }
    this.render()
  }

  /**
   * update all the attributes of a single node at a given index
   * @param index
   * @param updatedNode
   */
  @validateArgs
  public updateNode(
    @required index: number,
    @required updatedNode: DisplayNode,
  ) {
    this.data.nodes[index] = updatedNode
    this.nodesMesh.updateOne(index, updatedNode)
    this.interaction.updateData(this.data.nodes)
    this.groupsMesh.updateAll(this.data.nodes, this.data.groups)
    this.render()
  }

  /**
   * updates only the groups mesh.
   * Useful in situations that require ONLY display groups to update.
   * E.g. toggling a group on or off when the nodes within a group
   * have NOT changed.
   * @param groups
   */
  @validateArgs
  public updateGroups(@required groups: DisplayGroup[]) {
    this.data.groups = groups
    this.groupsMesh.updateAll(this.data.nodes, this.data.groups)
    this.render()
  }

  /**
   * resize the canvas
   * @param width
   * @param height
   */
  @validateArgs
  public resize(@required width: number, @required height: number) {
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
  public toScreenSpacePoint(worldX = 0, worldY = 0): THREE.Vector3 {
    const pos = new THREE.Vector3(worldX, worldY, 0)
    pos.project(this.camera)

    return new THREE.Vector3(
      THREE.MathUtils.mapLinear(pos.x, -1, 1, 0, this.width),
      THREE.MathUtils.mapLinear(pos.y, 1, -1, 0, this.height),
      0,
    )
  }

  /**
   * public method to zoom the graph
   * @param factor
   */
  public zoom(factor = 0) {
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

  private zoomToFit = (graphData: VisualizationInputData) => {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore TODO explicitly downgrade to Box2
    boundingBox = new THREE.Box2().copy(boundingBox)
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore TODO explicitly downgrade to Box2
    visibleBox = new THREE.Box2().copy(visibleBox)

    if (visibleBox.equals(boundingBox)) {
      return
    }

    const maxZoom = 4.0
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
    event: MouseEvent,
  ) => {
    this.userHasAdjustedViewport = true
    if (this.registeredEventHandlers.dragStart) {
      this.registeredEventHandlers.dragStart(
        worldSpaceMouse,
        draggedNodeIdx,
        event,
      )
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

  private handleDragEnd = (
    worldSpaceMouse: THREE.Vector3,
    nodeIdx: number,
    event: MouseEvent,
  ) => {
    if (this.registeredEventHandlers.dragEnd) {
      this.registeredEventHandlers.dragEnd(worldSpaceMouse, nodeIdx, event)
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
    event: MouseEvent,
  ) => {
    if (clickedNodeIdx === null || !this.registeredEventHandlers.click) {
      return
    }

    this.registeredEventHandlers.click(worldSpaceMouse, clickedNodeIdx, event)
    this.render()
  }

  private handleSecondaryClick = (
    event: MouseEvent,
    clickedNodeIdx: number | null,
  ) => {
    if (!this.registeredEventHandlers.secondaryClick) {
      return
    }
    this.registeredEventHandlers.secondaryClick(event, clickedNodeIdx)
  }
}
