import * as d3 from 'd3'
import {get, noop, size} from 'lodash'
import {GraphVizCluster} from './Clusters'

export interface ForceSimulationNode extends d3.SimulationNodeDatum {
  id: string

  clusterIds?: string[]

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

  /**
   * d3 force manyBody strength
   * @see https://github.com/d3/d3-force#forceManyBody
   */
  charge?: number
}

export interface ForceSimulationLink {
  source: string
  target: string
}

export interface ForceSimulationData {
  nodes: ForceSimulationNode[]
  links: ForceSimulationLink[]
  clusters: GraphVizCluster[]
}

type D3Simulation = d3.Simulation<d3.SimulationNodeDatum, ForceSimulationLink>

function getForceLinkDistance(links: {source: string; target: string}[]) {
  // NOTE: For now this is set heuristically on visual appearance/performance of large graphs.
  // We should ideally measure performance & appearance and tweak this accordingly.
  const dropoff = 30 - links.length / 50
  return Math.max(dropoff, 0.3)
}

export interface NodePosition {
  id: string
  x: number
  y: number
  z?: number
}

const forceCluster = (
  nodes: ForceSimulationNode[],
  clusters: GraphVizCluster[],
) => (alpha: number) => {
  for (
    let i = 0, n = nodes.length, node: any, cluster: any, k = alpha * 1;
    i < n;
    ++i
  ) {
    node = nodes[i]
    if (size(node.clusterIds) > 0) {
      cluster = clusters.find(c => c.id === node.clusterIds[0])
      if (cluster) {
        node.vx -= (node.x - cluster.x) * k
        node.vy -= (node.y - cluster.y) * k
      }
    }
  }
}

export class BasicForceSimulation {
  private simulation: D3Simulation | undefined
  private registeredEventHandlers: {
    tick: (nodePositions: NodePosition[]) => void
  } = {
    // Default no-op implementation. Will be overwritten by the callback provided to onSimulationTick
    tick: noop,
  }

  public initialize(graph: ForceSimulationData) {
    const nodesCopy = graph.nodes.map(node => ({
      ...node,
      cluster: get(node.clusterIds, 0, 1),
    }))
    const linksCopy = graph.links.map(link => ({...link}))
    const clustersCopy = graph.clusters.map(c => ({
      ...c,
      x: Math.random() * 200,
      y: Math.random() * 200,
    }))

    const linkForceDistance = getForceLinkDistance(linksCopy)

    // stop any previous simulation before reinitializing to prevent
    // zombie tick events
    if (this.simulation) {
      this.simulation.stop()
    }

    this.simulation = d3
      .forceSimulation(nodesCopy)
      .force('cluster', forceCluster(nodesCopy, clustersCopy))
      .force(
        'x',
        d3
          .forceX()
          .strength((node: ForceSimulationNode) =>
            node.forceX !== undefined ? 0.1 : 0,
          )
          .x((node: ForceSimulationNode) => node.forceX || 0),
      )
      .force(
        'y',
        d3
          .forceY()
          .strength((node: ForceSimulationNode) =>
            node.forceY !== undefined ? 0.1 : 0,
          )
          .y((node: ForceSimulationNode) => node.forceY || 0),
      )
      .force(
        'links',
        d3
          .forceLink(linksCopy)
          .id((n: ForceSimulationNode) => n.id)
          .distance(linkForceDistance),
      )
      .force(
        'charge',
        d3
          .forceManyBody()
          .strength((n: ForceSimulationNode) =>
            n.charge !== undefined ? n.charge : -100,
          )
          .distanceMax(250),
      )
      .velocityDecay(0.5)
      .on('tick', () => {
        this.registeredEventHandlers.tick(this.getNodePositions())
      })
  }

  public getNodePositions(): NodePosition[] {
    if (!this.simulation) {
      return []
    }
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
    if (!this.simulation) {
      return
    }

    const nodesCopy = graph.nodes.map(node => ({...node}))
    const linksCopy = graph.links.map(link => ({...link}))

    const linkForceDistance = getForceLinkDistance(linksCopy)
    this.simulation.nodes(nodesCopy).force(
      'links',
      d3
        .forceLink(linksCopy)
        .id((n: ForceSimulationNode) => n.id)
        .distance(linkForceDistance),
    )
  }

  public restart() {
    if (!this.simulation) {
      return
    }
    this.simulation.alpha(1)
    this.simulation.restart()
  }

  public reheat() {
    if (!this.simulation) {
      return
    }
    this.simulation.alphaTarget(0.8).restart()
  }

  public settle() {
    if (!this.simulation) {
      return
    }
    this.simulation.alphaTarget(0)
  }

  public stop() {
    if (!this.simulation) {
      return
    }
    this.simulation.stop()
  }
}
