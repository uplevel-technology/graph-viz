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

export class ForceSimulation {
  private simulation: D3Simulation
  private onSimulationTick: (graphData: VisualGraphData) => {}

  constructor(graphData: SimulationInput, onSimulationTick: (graphData: VisualGraphData) => {}) {
    this.onSimulationTick = onSimulationTick
    const linksWithIds = flattenLinks(graphData.links)

    this.simulation = d3.forceSimulation(graphData.nodes)
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0))
      .force('links', d3.forceLink(linksWithIds).id((n: SimulationNode) => n.id))
      .force('charge', d3.forceManyBody().strength(-50))
      .velocityDecay(0.7)
      .on('tick', this.tick)
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
      .force('links', d3.forceLink(linksWithIds).id((n: SimulationNode) => n.id))
  }

  public restart() {
    this.simulation.alphaTarget(0.8).restart()
  }

  public stop() {
    this.simulation.alphaTarget(0)
  }

}
