import * as d3 from 'd3'
import {findIndex, merge, reduce} from 'lodash'
import {VisualGraphData, VisualGraphNode} from './GraphVisualization'

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
export type SimNode = VisualGraphNode & d3.SimulationNodeDatum

export interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  id: string
  source: SimNode
  target: SimNode
}

export type Simulation = d3.Simulation<SimNode, SimLink>

export class ForceSimulation {
  constructor(graph: VisualGraphData) {
    return d3.forceSimulation(graph.nodes)
      .force('links', d3.forceLink(graph.links).id((e: SimLink) => e.id).distance(1).strength(1.0))
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0))
      .force('charge', d3.forceManyBody().strength(-100))
      .velocityDecay(0.7) as Simulation
  }
}
