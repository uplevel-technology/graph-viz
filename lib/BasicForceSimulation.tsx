import * as d3 from 'd3'

export interface ForceSimulationNode extends d3.SimulationNodeDatum {
  id: string

  /**
   * d3 forceX seed value
   * @see https://github.com/d3/d3-force#forceX
   */
  forceX?: number

  /**
   * d3 forceY seed value
   * @see https://github.com/d3/d3-force#forceY
   */
  forceY?: number

}

interface ForceSimulationLink {
  source: string
  target: string
}

interface ForceSimulationData {
  nodes: ForceSimulationNode[]
  links: ForceSimulationLink[]
}

type D3Simulation = d3.Simulation<d3.SimulationNodeDatum, ForceSimulationLink>

function getForceLinkDistance(links: {source: string, target: string}[]) {
  // NOTE: For now this is set heuristically on visual appearance/performance of large graphs.
  // We should ideally measure performance & appearance and tweak this accordingly.
  const dropoff = 30 - (links.length / 50)
  return Math.max(dropoff, 0.3)
}

interface NodePosition {
  id: string
  x: number
  y: number
  z?: number
}

export class BasicForceSimulation {
  private simulation: D3Simulation

  private tickEventHandler(nodePositions: NodePosition[]) {
    // Default no op implementation. Will be overwritten by the callback provided to onSimulationTick
    return
  }

  constructor(graph: ForceSimulationData) {
    const linkForceDistance = getForceLinkDistance(graph.links)

    this.simulation = d3.forceSimulation(graph.nodes)
    // TODO figure out how to conditionally apply force in x direction based on node value
    // (because apply force in direction of 0 is not what we want!)
      .force('x', d3.forceX().x((node: ForceSimulationNode) => node.forceX || 0))
      .force('y', d3.forceY().y((node: ForceSimulationNode) => node.forceY || 0))
      .force('links', d3.forceLink(graph.links).id((n: ForceSimulationNode) => n.id).distance(linkForceDistance))
      .force('charge', d3.forceManyBody().strength(-200))
      .velocityDecay(0.7)
      .on('tick', () => {
        this.tickEventHandler(this.getPositions())
      })
  }

  public getPositions(): NodePosition[] {
    const nodes = this.simulation.nodes() as ForceSimulationNode[]

    return nodes.map(node => ({
      id: node.id,
      x: node.x || 0,
      y: node.y || 0,
    }))
  }

  public onSimulationTick(callback: (nodePositions: NodePosition[]) => void) {
    this.tickEventHandler = callback
  }

  public update(graph: ForceSimulationData) {
    const linkForceDistance = getForceLinkDistance(graph.links)
    this.simulation
      .nodes(graph.nodes)
      .force('links', d3.forceLink(graph.links).id((n: ForceSimulationNode) => n.id).distance(linkForceDistance))
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
