import * as d3 from 'd3'
import {meanBy, noop, defaults} from 'lodash'

export interface SimulationNode extends d3.SimulationNodeDatum {
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

export interface SimulationLink {
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

export interface SimulationGroup {
  id: string
  strength?: number
}

export interface SimulationData {
  nodes: SimulationNode[]
  links: SimulationLink[]
  forceGroups: SimulationGroup[]
}

type D3Simulation = d3.Simulation<d3.SimulationNodeDatum, SimulationLink>

export interface NodePosition {
  id: string
  x: number
  y: number
  z?: number
}

function forceGroup(groups: SimulationGroup[], defaultStrength: number) {
  let nodes: SimulationNode[]
  let nodesByGroup: {[groupId: string]: SimulationNode[]}
  let strength = defaultStrength

  function force(alpha: number) {
    groups.forEach(group => {
      if (!nodesByGroup[group.id]) {
        // this will happen for archived clusters
        return
      }

      const groupNodes = nodesByGroup[group.id]

      const {x: cx, y: cy} = getCentroid(groupNodes)
      const l = alpha * (group.strength ?? strength)

      groupNodes.forEach(node => {
        node.vx! -= (node.x! - cx) * l
        node.vy! -= (node.y! - cy) * l
      })
    })
  }

  // this function is automatically called by d3 on initialize
  force.initialize = (data: SimulationNode[]) => {
    nodes = data
    nodesByGroup = getGroupedNodes(nodes)
    return nodes
  }

  force.strength = (value: number) => {
    strength = value
  }

  return force
}

function getCentroid(points: SimulationNode[]): {x: number; y: number} {
  return {
    x: meanBy(points, p => p.x),
    y: meanBy(points, p => p.y),
  }
}

function getGroupedNodes(
  nodes: SimulationNode[],
): {[groupId: string]: SimulationNode[]} {
  const nodesByGroup: {[groupId: string]: SimulationNode[]} = {}
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

/**
 * Based on the default implementation
 * @see https://github.com/d3/d3-force#link_strength
 */
function getDefaultLinkForceStrengths(links: SimulationLink[]): number[] {
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

export interface ForceConfig {
  nodeCharge?: number
  linkStrengthMultiplier?: number
  groupStrength?: number
}
export const FORCE_DEFAULTS = {
  nodeCharge: -30,
  linkStrengthMultiplier: 1,
  groupStrength: 0,
}

export class ForceSimulation {
  public simulation: D3Simulation | undefined
  public staticMode = false
  private registeredEventHandlers: {
    tick: (nodePositions: NodePosition[]) => void
  } = {
    // Default no-op implementation. Will be overwritten by the callback provided to onSimulationTick
    tick: noop,
  }
  // this is tracked referentially so readonly is important here
  private readonly config: Required<ForceConfig> = FORCE_DEFAULTS

  private defaultLinkForceStrengths: number[] = []

  public initialize(
    graph: SimulationData,
    config: ForceConfig = FORCE_DEFAULTS,
    staticMode = false,
  ) {
    // reset undefined values to default values
    const mergedConfig = defaults({}, config, FORCE_DEFAULTS)
    Object.assign(this.config, mergedConfig) // preserve referential equality

    this.staticMode = staticMode
    const nodesCopy = graph.nodes.map(node => ({...node}))
    const linksCopy = graph.links.map(link => ({...link}))
    const groupsCopy = graph.forceGroups.map(group => ({...group}))

    this.defaultLinkForceStrengths = getDefaultLinkForceStrengths(linksCopy)

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
          .strength((node: SimulationNode) =>
            node.forceX !== undefined ? 0.1 : 0,
          )
          .x((node: SimulationNode) => node.forceX ?? 0),
      )
      .force(
        'y',
        d3
          .forceY()
          .strength((node: SimulationNode) =>
            node.forceY !== undefined ? 0.1 : 0,
          )
          .y((node: SimulationNode) => node.forceY ?? 0),
      )
      .force(
        'links',
        d3
          .forceLink(linksCopy)
          .strength(
            (link, i) =>
              this.defaultLinkForceStrengths[i] *
              (link.strengthMultiplier ?? this.config.linkStrengthMultiplier),
          )
          .id((n: SimulationNode) => n.id),
      )
      .force(
        'charge',
        d3
          .forceManyBody()
          .strength((n: SimulationNode) =>
            n.charge !== undefined ? n.charge : this.config.nodeCharge,
          ),
      )
      .force('group', forceGroup(groupsCopy, this.config.groupStrength))
      .on('tick', () => {
        this.registeredEventHandlers.tick(this.getNodePositions())
      })

    if (staticMode) {
      this.simulation.stop()
      this.execManualTicks()
    }
  }

  private execManualTicks() {
    if (this.simulation) {
      for (let i = 0, n = 300; i < n; ++i) {
        this.simulation.tick()
      }
    }
  }

  public getNodePositions(): NodePosition[] {
    if (!this.simulation) {
      return []
    }
    const nodes = this.simulation.nodes() as SimulationNode[]

    return nodes.map(node => ({
      id: node.id,
      x: node.x ?? 0,
      y: node.y ?? 0,
    }))
  }

  public onTick(callback: (nodePositions: NodePosition[]) => void) {
    this.registeredEventHandlers.tick = callback
  }

  /**
   * update config and force simulation as needed
   * @param newConfig
   */
  public updateConfig(newConfig?: ForceConfig) {
    if (!this.simulation) {
      return
    }
    const mergedConfig = defaults({}, newConfig, FORCE_DEFAULTS)

    if (this.config.nodeCharge !== mergedConfig.nodeCharge) {
      // NOTE: preserve reference for this.config !important
      this.config.nodeCharge = mergedConfig.nodeCharge
      const forceMB = this.simulation.force('charge') as d3.ForceManyBody<
        SimulationNode
      >
      forceMB.strength((n: SimulationNode) =>
        n.charge !== undefined ? n.charge : this.config.nodeCharge,
      )
    }

    if (
      this.config.linkStrengthMultiplier !== mergedConfig.linkStrengthMultiplier
    ) {
      this.config.linkStrengthMultiplier = mergedConfig.linkStrengthMultiplier
      const forceLink = this.simulation.force('links') as d3.ForceLink<
        SimulationNode,
        SimulationLink
      >
      forceLink.strength(
        (link, i) =>
          this.defaultLinkForceStrengths[i] *
          (link.strengthMultiplier ?? this.config.linkStrengthMultiplier),
      )
    }

    if (this.config.groupStrength !== mergedConfig.groupStrength) {
      this.config.groupStrength = mergedConfig.groupStrength
      const force = this.simulation.force('group') as ReturnType<
        typeof forceGroup
      >
      force.strength(this.config.groupStrength)
    }

    this.simulation.alpha(0.1).restart()
  }

  public update(graph: SimulationData) {
    if (!this.simulation) {
      return
    }

    const nodesCopy = graph.nodes.map(node => ({...node}))
    const linksCopy = graph.links.map(link => ({...link}))

    this.simulation.nodes(nodesCopy).force(
      'links',
      d3.forceLink(linksCopy).id((n: SimulationNode) => n.id),
    )
    // if (this.staticMode) {
    //   this.execManualTicks()
    // }
  }

  public restart() {
    if (!this.simulation) {
      return
    }
    // if (this.staticMode) {
    //   this.execManualTicks()
    // }
    this.simulation.alpha(1)
    this.simulation.restart()
  }

  public reheat() {
    if (!this.simulation) {
      return
    }
    // if (this.staticMode) {
    //   this.execManualTicks()
    // }
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
