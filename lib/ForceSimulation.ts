import * as d3 from 'd3'
import {findIndex, merge, reduce} from 'lodash'

export const mergeById = (originalArray: Array<any>, updatedArray: Array<any>): Array<any> =>
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

export interface SimNode extends d3.SimulationNodeDatum {
  // NOTE: Simulation nodes actually accept and shallow merge
  // arbitrary keys, but d3.SimulationNodeDatum type definition is incorrect
  [key: string]: any
}

export interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  id: string
  source: SimNode
  target: SimNode
}

export type D3Simulation = d3.Simulation<SimNode, SimLink>

export interface SimulationInput {
  nodes: SimNode[],
  links: SimLink[],
}

export function initSimulation(graph: SimulationInput): D3Simulation {
  return d3.forceSimulation(graph.nodes)
    .force('links', d3.forceLink(graph.links).id((e: SimLink) => e.id).distance(1).strength(1.0))
    .force('x', d3.forceX(0))
    .force('y', d3.forceY(0))
    .force('charge', d3.forceManyBody().strength(-100))
    .velocityDecay(0.7)
}

export function updateSimulation(simulation: D3Simulation, graph: SimulationInput) {
  simulation
    .nodes(graph.nodes)
    .force('links', d3.forceLink(graph.links).id((e: SimLink) => e.id))
}

export class ForceSimulation {
  public simulation: D3Simulation

  public init = (graph: SimulationInput): D3Simulation => {
    this.simulation = d3.forceSimulation(graph.nodes)
      .force('links', d3.forceLink(graph.links).id((e: SimLink) => e.id).distance(1).strength(1.0))
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0))
      .force('charge', d3.forceManyBody().strength(-100))
      .velocityDecay(0.7)

    return this.simulation
  }

  public update(graph: SimulationInput) {
    this.simulation
      .nodes(graph.nodes)
      .force('links', d3.forceLink(graph.links).id((e: SimLink) => e.id))
  }
}
