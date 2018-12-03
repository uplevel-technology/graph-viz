import * as d3 from 'd3'
import {findIndex, get, merge, reduce, size} from 'lodash'
import * as THREE from 'three'
import {Lines} from './Lines'
import {MouseInteraction} from './MouseInteraction'
import {Nodes} from './Nodes'

const mergeById = (originalArray: Array<any>, updatedArray: Array<any>): Array<any> =>
  reduce(
    updatedArray,
    (acc, newElem) => {
      // find an element with matching id as newElem.id
      const existingElemIdx = findIndex(acc, (e) => e.id === newElem.id)

      if (existingElemIdx >= 0) {
        // NOTE (sm): Lodash Merge mutates object, thus maintaining referential equality
        merge(acc[existingElemIdx], newElem)
      } else {
        acc.push(newElem)
      }

      return acc
    },
    [...originalArray],
  )

export interface VisualGraphNode extends d3.SimulationNodeDatum {
  displayName: string
  inactive?: boolean
  fill?: number | string
  stroke?: number | string
  strokeOpacity?: number
  strokeWidth?: number
  [property: string]: any // TODO make VisualGraphNode a union type with DisplayAttributes | Incident | Target | Threat
}

export interface VisualGraphLink extends d3.SimulationLinkDatum<VisualGraphNode> {
  id?: string
  source: string
  target: string
  color?: number | string
}

export interface VisualGraphData {
  nodes: Array<VisualGraphNode>
  links: Array<VisualGraphLink>
}

export type SimNode = VisualGraphNode & d3.SimulationNodeDatum

export interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  id: string
  source: SimNode
  target: SimNode
}

export type Simulation = d3.Simulation<SimNode, SimLink>

export class GraphVisualization {
  public simulation: Simulation
  public nodes: Nodes
  public lines: Lines

  public onNodeClick: (clickedNode: SimNode) => {}
  public onHover: (hoveredNode: SimNode) => void
  public onSimulationTick: (simulation: Simulation) => {}

  private userHasAdjustedViewport: boolean
  private readonly camera: THREE.OrthographicCamera
  private readonly scene: THREE.Scene
  private readonly renderer: THREE.WebGLRenderer
  private readonly mouseInteraction: MouseInteraction
  private readonly canvas: HTMLCanvasElement

  constructor(graph: VisualGraphData, canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas

    this.simulation = this.initSimulation(graph)

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

    this.nodes = new Nodes(this.simulation, this.camera)
    this.lines = new Lines(this.simulation)

    this.scene.add(this.lines.object)
    this.nodes.object.position.z = 3
    this.scene.add(this.nodes.object)

    this.render()

    this.mouseInteraction = new MouseInteraction(this.canvas, this.camera, this.nodes)
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

  public zoomToFit = () => {
    if (this.simulation.nodes().length === 0) {
      // Don't try to do this if there are no nodes.
      return
    }

    let boundingBox = new THREE.Box3().setFromObject(this.nodes.object)
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
    this.nodes.handleCameraZoom()
  }

  public update = (graph: VisualGraphData) => {
    if (size(this.simulation.nodes()) === 0 && size(graph.nodes) > 0) {
      // Re-initialize simulation if it's the first load for better stabilization
      this.simulation = this.initSimulation(graph)
      this.nodes.simulation = this.simulation
      this.lines.simulation = this.simulation
    } else {
      const newNodes = mergeById(this.simulation.nodes(), graph.nodes)
      const newEdges = mergeById(
        (this.simulation.force('links') as d3.ForceLink<SimNode, SimLink>).links(),
        graph.links,
      )
      this.simulation
        .nodes(newNodes)
        .force('links', d3.forceLink(newEdges).id((e: SimLink) => e.id))
    }

    this.nodes.redraw()
    this.lines.redraw()

    this.simulation.alpha(1)
    // Run the first few ticks of the simulation before we start drawing:
    // "Note that tick events are not dispatched when simulation.tick is called manually"
    d3.range(10).forEach(this.simulation.tick)
    this.simulation.restart()
  }

  public dispose() {
    this.nodes.dispose()
    this.lines.dispose()
    this.renderer.dispose()
  }

  private initSimulation = (graph: VisualGraphData) => {
    return d3.forceSimulation(graph.nodes)
      .force('links', d3.forceLink(graph.links).id((e: SimLink) => e.id).distance(1).strength(1.0))
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0))
      .force('charge', d3.forceManyBody().strength(-100))
      .velocityDecay(0.7)
      .on('tick', this.tick) as Simulation
  }

  private tick = () => window.requestAnimationFrame(() => {
    this.nodes.updatePositions()
    this.lines.updatePositions()
    if (!this.userHasAdjustedViewport) {
      this.zoomToFit()
    }
    this.render()

    if (this.onSimulationTick) {
      this.onSimulationTick(this.simulation)
    }
  })

  private handleHover = (hoveredToNodeIdx: number | null, hoveredFromNodeIdx: number | null) => {
    this.nodes.scalePointAt(hoveredFromNodeIdx, 1.0) // reset previously hovered
    this.nodes.scalePointAt(hoveredToNodeIdx, 1.75)
    this.render()

    if (this.onHover) {
      this.onHover(get(this.simulation.nodes(), hoveredToNodeIdx))
    }
  }

  private handleDragStart = (mouse: THREE.Vector3, draggedNodeIdx: number | null) => {
    this.userHasAdjustedViewport = true
    if (draggedNodeIdx) {
      this.simulation.alphaTarget(0.8).restart()
    }
  }

  private handleDrag = (mouse: THREE.Vector3, draggedNode: number) => {
    if (draggedNode) {
      // lock node
      const nodes = this.simulation.nodes()
      nodes[draggedNode].fx = mouse.x
      nodes[draggedNode].fy = mouse.y
      this.nodes.lockPointAt(draggedNode)
    }
    this.render()
  }

  private handleDragEnd = () => {
    this.simulation.alphaTarget(0)
  }

  private handlePan = () => {
    this.userHasAdjustedViewport = true
    this.render()
  }

  private handleZoomOnWheel = () => {
    this.userHasAdjustedViewport = true
    this.nodes.handleCameraZoom()
    this.render()
  }

  private zoom = (factor: number) => {
    this.userHasAdjustedViewport = true
    this.camera.zoom += factor * this.camera.zoom
    this.camera.updateProjectionMatrix()
    this.nodes.handleCameraZoom()
    this.render()
  }

  private handleClick = (mouse: THREE.Vector3, clickedNodeIdx: number | null) => {
    if (clickedNodeIdx) { // FIXME: 0 is falsy
      const nodes = this.simulation.nodes()
      if (get(nodes, `${clickedNodeIdx}.fx`)) {
        // release node
        nodes[clickedNodeIdx].fx = null
        nodes[clickedNodeIdx].fy = null
        this.nodes.unlockPointAt(clickedNodeIdx)
      } else {
        nodes[clickedNodeIdx].fx = mouse.x
        nodes[clickedNodeIdx].fy = mouse.y
        this.nodes.lockPointAt(clickedNodeIdx)
      }

      if (this.onNodeClick) {
        this.onNodeClick(nodes[clickedNodeIdx])
      }

      this.render()
    }
  }
}
