import * as d3 from 'd3'
import {VisualGraphData, VisualGraphLink, VisualGraphNode} from './GraphVisualization'

type SimulationNode = VisualGraphNode & d3.SimulationNodeDatum
type SimulationLink = VisualGraphLink & d3.SimulationLinkDatum<SimulationNode>
type D3Simulation = d3.Simulation<SimulationNode, SimulationLink>

// This interface is compatible with VisualGraphData
export interface SimulationInput {
  nodes: SimulationNode[],
  links: SimulationLink[],
}

const flattenLinks = (links: VisualGraphLink[]) =>
  links.map(l => ({
    source: l.source.id,
    target: l.target.id,
  }))

// Interfaces that any custom class should implement
export interface SimulationInterface {
  initialize: (graphData: SimulationInput) => void
  update: (graphData: SimulationInput) => void
  restart: () => void
  stop: () => void
  getVisualGraph: () => VisualGraphData
}

export class ForceSimulation implements SimulationInterface {
  private simulation: D3Simulation
  private onSimulationTick: ((graphData: VisualGraphData) => void) | undefined

  constructor(onSimulationTick?: (graphData: VisualGraphData) => void) {
    this.onSimulationTick = onSimulationTick
  }

  private getForceLinkDistance(
    link: {source: string, target: string},
    i: number,
    links: {source: string, target: string}[],
  ) {
    // NOTE: For now this is set heuristically on visual appearance/performance of large graphs.
    // We should ideally measure performance & appearance and tweak this accordingly.
    const dropoff = 30 - (links.length / 50)
    return Math.max(dropoff, 0.3)
  }

  private tick = () => {
    if (this.onSimulationTick) {
      const visualGraph = this.getVisualGraph()
      this.onSimulationTick(visualGraph)
    }
  }

  public getVisualGraph(): VisualGraphData {
    const linkForces = this.simulation.force('links') as d3.ForceLink<SimulationNode, SimulationLink>

    return {
      nodes: this.simulation.nodes() as VisualGraphNode[],
      links: linkForces.links() as VisualGraphLink[],
    }
  }

  public initialize(graph: SimulationInput) {
    const linksWithIds = flattenLinks(graph.links)
    this.simulation = d3.forceSimulation(graph.nodes)
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0))
      .force('links', d3.forceLink(linksWithIds).id((n: SimulationNode) => n.id).distance(this.getForceLinkDistance))
      .force('charge', d3.forceManyBody().strength(-50))
      .velocityDecay(0.7)
      .on('tick', this.tick)
  }

  public update(graph: SimulationInput) {
    const linksWithIds = flattenLinks(graph.links)
    this.simulation
      .nodes(graph.nodes)
      .force('links', d3.forceLink(linksWithIds).id((n: SimulationNode) => n.id).distance(this.getForceLinkDistance))
  }

  public restart() {
    this.simulation.alphaTarget(0.8).restart()
  }

  public stop() {
    this.simulation.alphaTarget(0)
  }
}
