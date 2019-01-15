import * as d3 from 'd3'
import {VisualGraphData, VisualGraphLink, VisualGraphNode} from './GraphVisualization'
import {SimulationInterface} from './SimulationInterface'

type D3Simulation = d3.Simulation<VisualGraphNode, VisualGraphLink>

const flattenLinks = (links: VisualGraphLink[]) =>
  links.map(l => ({
    ...l,
    source: l.source.id,
    target: l.target.id,
  }))

export class DefaultForceSimulation implements SimulationInterface {
  private simulation: D3Simulation
  private tickEventHandler(graphData: VisualGraphData) {
    // Default no op implementation. Will be overwritten by the callback provided to onSimulationTick
    return
  }

  private getForceLinkDistance(
    links: {source: string, target: string}[],
  ) {
    // NOTE: For now this is set heuristically on visual appearance/performance of large graphs.
    // We should ideally measure performance & appearance and tweak this accordingly.
    const dropoff = 30 - (links.length / 50)
    return Math.max(dropoff, 0.3)
  }

  public getVisualGraph(): VisualGraphData {
    const linkForces = this.simulation.force('links') as d3.ForceLink<VisualGraphNode, VisualGraphLink>

    return {
      nodes: this.simulation.nodes() as VisualGraphNode[],
      links: linkForces.links() as VisualGraphLink[],
    }
  }

  public initialize(graph: VisualGraphData) {
    const linksWithIds = flattenLinks(graph.links)

    const linkForceDistance = this.getForceLinkDistance(linksWithIds)

    this.simulation = d3.forceSimulation(graph.nodes)
    // TODO figure out how to conditionally apply force in x direction based on node value
    // (because apply force in direction of 0 is not what we want!)
      .force('x', d3.forceX().x((node: VisualGraphNode) => node.forceX || 0))
     .force('y', d3.forceY().y((node: VisualGraphNode) => node.forceY  || 0))
     .force('links', d3.forceLink(linksWithIds).id((n: VisualGraphNode) => n.id).distance(linkForceDistance))
      .force('charge', d3.forceManyBody().strength(-200))
      .velocityDecay(0.7)
      .on('tick', () => {
        const visualGraph = this.getVisualGraph()
        this.tickEventHandler(visualGraph)
      })
  }

  public onSimulationTick(callback: (graphData: VisualGraphData) => void) {
    this.tickEventHandler = callback
  }

  public update(graph: VisualGraphData) {
    const linksWithIds = flattenLinks(graph.links)
    const linkForceDistance = this.getForceLinkDistance(linksWithIds)
    this.simulation
      .nodes(graph.nodes)
     .force('links', d3.forceLink(linksWithIds).id((n: VisualGraphNode) => n.id).distance(linkForceDistance))
  }

  public restart() {
    this.simulation.alpha(1)
    this.simulation.restart()
  }

  public reheat() {
    this.simulation.alphaTarget(0.8).restart()
  }

  public stop() {
    this.simulation.alphaTarget(0)
  }
}
