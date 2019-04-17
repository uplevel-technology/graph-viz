import * as d3 from 'd3'
import {meanBy, noop} from 'lodash'

export interface ForceSimulationNode extends d3.SimulationNodeDatum {
  id: string

  displayGroupIds?: string[]

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

  /**
   * Multiplicative factor applied to default d3 link force,
   * which serves as an attractive force between the endpoints.
   * A value between 0 and 1 will reduce the attractive force,
   * tending to increase the length of the link.
   * @see https://github.com/d3/d3-force#link_strength
   */
  strengthMultiplier?: number
}

export interface ForceSimulationGroup {
  id: string
  strength: number
}

export interface ForceSimulationData {
  nodes: ForceSimulationNode[]
  links: ForceSimulationLink[]
  forceGroups: ForceSimulationGroup[]
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

function forceGroup(groups: ForceSimulationGroup[]) {
  let nodes: ForceSimulationNode[]
  let nodesByGroup: {[groupId: string]: ForceSimulationNode[]}

  function force(alpha: number) {
    groups.forEach(group => {
      if (!nodesByGroup[group.id]) {
        // this will happen for archived clusters
        return
      }

      const groupNodes = nodesByGroup[group.id]

      const {x: cx, y: cy} = getCentroid(groupNodes)
      const l = alpha * group.strength

      groupNodes.forEach(node => {
        node.vx! -= (node.x! - cx) * l
        node.vy! -= (node.y! - cy) * l
      })
    })
  }

  // this function is automatically called by d3 on initialize
  force.initialize = (data: ForceSimulationNode[]) => {
    nodes = data
    nodesByGroup = getGroupedNodes(nodes)
    return nodes
  }

  return force
}

function getCentroid(points: ForceSimulationNode[]): {x: number; y: number} {
  return {
    x: meanBy(points, p => p.x),
    y: meanBy(points, p => p.y),
  }
}

function getGroupedNodes(
  nodes: ForceSimulationNode[],
): {[groupId: string]: ForceSimulationNode[]} {
  const nodesByGroup: {[groupId: string]: ForceSimulationNode[]} = {}
  nodes.forEach((n, i) => {
    if (n.displayGroupIds) {
      n.displayGroupIds.forEach(groupId => {
        if (!nodesByGroup[groupId]) {
          nodesByGroup[groupId] = []
        }

        nodesByGroup[groupId].push(n)
      })
    }
  })
  return nodesByGroup
}

function getDefaultLinkForceStrengths(links: ForceSimulationLink[]): number[] {
  const counts: {[id: string]: number} = {}

  links.forEach((l, i) => {
    if (!counts[l.source]) {
      counts[l.source] = 0
    }
    counts[l.source]++

    if (!counts[l.target]) {
      counts[l.target] = 0
    }
    counts[l.target]++
  })

  return links.map(link => {
    return 1.0 / Math.min(counts[link.source], counts[link.target])
  })
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
    const nodesCopy = graph.nodes.map(node => ({...node}))
    const linksCopy = graph.links.map(link => ({...link}))
    const groupsCopy = graph.forceGroups.map(group => ({...group}))

    const linkForceDistance = getForceLinkDistance(linksCopy)
    const defaultLinkForceStrengths = getDefaultLinkForceStrengths(linksCopy)

    // stop any previous simulation before reinitializing to prevent
    // zombie tick events
    if (this.simulation) {
      this.simulation.stop()
    }

    this.simulation = d3
      .forceSimulation(nodesCopy)
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
          .strength((link, i) =>
            link.strengthMultiplier !== undefined
              ? defaultLinkForceStrengths[i] * link.strengthMultiplier
              : defaultLinkForceStrengths[i],
          )
          .id((n: ForceSimulationNode) => n.id)
          .distance(linkForceDistance),
      )
      .force(
        'charge',
        d3
          .forceManyBody()
          .strength((n: ForceSimulationNode) =>
            n.charge !== undefined ? n.charge : -250,
          )
          .distanceMax(250),
      )
      .force('group', forceGroup(groupsCopy))
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
