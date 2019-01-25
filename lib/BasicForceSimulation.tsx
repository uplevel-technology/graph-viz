import * as d3 from 'd3'
import {noop} from 'lodash'

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

export interface ForceSimulationLink {
  source: string
  target: string
}

export interface ForceSimulationData {
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

export interface NodePosition {
  id: string
  x: number
  y: number
  z?: number
}

export class BasicForceSimulation {
  private simulation: D3Simulation
  private registeredEventHandlers: {
    tick: (nodePositions: NodePosition[]) => void,
  } = {
    // Default no-op implementation. Will be overwritten by the callback provided to onSimulationTick
    tick: noop,
  }

  public initialize(graph: ForceSimulationData) {
    const nodesCopy = graph.nodes.map(node => ({...node}))
    const linksCopy = graph.links.map(link => ({...link}))

    const linkForceDistance = getForceLinkDistance(linksCopy)

    this.simulation = d3.forceSimulation(nodesCopy)
    // TODO figure out how to conditionally apply force in x direction based on node value
    // (because apply force in direction of 0 is not what we want!)
      .force('x', d3.forceX().x((node: ForceSimulationNode) => node.forceX || 0))
      .force('y', d3.forceY().y((node: ForceSimulationNode) => node.forceY || 0))
      .force('links', d3.forceLink(linksCopy).id((n: ForceSimulationNode) => n.id).distance(linkForceDistance))
      .force('charge', d3.forceManyBody().strength(-100))
      .velocityDecay(0.5)
      .on('tick', () => {
        this.registeredEventHandlers.tick(this.getNodePositions())
      })
  }

  public getNodePositions(): NodePosition[] {
    const nodes = this.simulation.nodes() as ForceSimulationNode[]

    return nodes.map(node => ({
      id: node.id,
      x: node.x || 0,
      y: node.y || 0,
    }))
  }

  public onTick(callback: (nodePositions: NodePosition[]) => void) {
    this.registeredEventHandlers.tick = callback
  }

  public update(graph: ForceSimulationData) {
    const nodesCopy = graph.nodes.map(node => ({...node}))
    const linksCopy = graph.links.map(link => ({...link}))

    const linkForceDistance = getForceLinkDistance(linksCopy)
    this.simulation
      .nodes(nodesCopy)
      .force('links', d3.forceLink(linksCopy).id((n: ForceSimulationNode) => n.id).distance(linkForceDistance))
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
