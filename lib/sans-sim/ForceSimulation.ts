import * as d3 from 'd3'
import {VisualGraphData, VisualGraphLink, VisualGraphNode} from './GraphVisualization'

type SimulationNode = VisualGraphNode & d3.SimulationNodeDatum
type SimulationLink = VisualGraphLink & d3.SimulationLinkDatum<SimulationNode>
export type D3Simulation = d3.Simulation<SimulationNode, SimulationLink>

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

export class ForceSimulation {
  private simulation: D3Simulation
  private onSimulationTick: (graphData: VisualGraphData) => {}

  constructor(
    graphData: SimulationInput,
    onSimulationTick: (graphData: VisualGraphData) => {},
    d3Simulation?: D3Simulation,
  ) {
    this.onSimulationTick = onSimulationTick
    const linksWithIds = flattenLinks(graphData.links)

    if (d3Simulation) {
      this.simulation = d3Simulation
    } else {
      this.simulation = d3.forceSimulation(graphData.nodes)
        .force('x', d3.forceX(0))
        .force('y', d3.forceY(0))
        .force('links', d3.forceLink(linksWithIds).id((n: SimulationNode) => n.id).distance(this.getForceLinkDistance))
        .force('charge', d3.forceManyBody().strength(-50))
        .velocityDecay(0.7)
        .on('tick', this.tick)
    }
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
    const visualGraph = this.getVisualGraph()
    this.onSimulationTick(visualGraph)
  }

  public getVisualGraph(): VisualGraphData {
    const linkForces = this.simulation.force('links') as d3.ForceLink<SimulationNode, SimulationLink>

    return {
      nodes: this.simulation.nodes() as VisualGraphNode[],
      links: linkForces.links() as VisualGraphLink[],
    }
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
