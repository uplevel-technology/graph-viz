import * as d3 from 'd3'
import {findIndex, merge, reduce} from 'lodash'
import {
  VisualGraphData,
  VisualGraphLink,
  VisualGraphNode,
  VisualizationInputLink,
  VisualizationInputNode,
} from './GraphVisualization'

// TODO: remove this and maintain nodes and links in an object
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

type SimulationNode = VisualizationInputNode & d3.SimulationNodeDatum

type SimulationLink = VisualizationInputLink & d3.SimulationLinkDatum<SimulationNode>

export type D3Simulation = d3.Simulation<SimulationNode, SimulationLink>

// This interface is compatible with VisualizationInput
export interface SimulationInput {
  nodes: SimulationNode[],
  links: SimulationLink[],
}

export class ForceSimulation {
  private simulation: D3Simulation

  constructor(graphData: SimulationInput) {
    this.simulation = d3.forceSimulation(graphData.nodes)
      .force('links', d3.forceLink(graphData.links).id((e: SimulationLink) => e.id).distance(1).strength(1.0))
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0))
      .force('charge', d3.forceManyBody().strength(-100))
      .velocityDecay(0.7)
  }

  public getVisualGraph(): VisualGraphData {
    const linkForces = this.simulation.force('links') as d3.ForceLink<SimulationNode, SimulationLink>

    return {
      nodes: this.simulation.nodes() as VisualGraphNode[],
      links: linkForces.links() as VisualGraphLink[],
    }
  }

  public update(graph: SimulationInput) {
    const newNodes = mergeById(this.simulation.nodes(), graph.nodes)
    const newLinks = mergeById(
      (this.simulation.force('links') as d3.ForceLink<SimulationNode, SimulationLink>).links(),
      graph.links,
    )
    this.simulation
      .nodes(newNodes)
      .force('links', d3.forceLink(newLinks).id((e: SimulationLink) => e.id))

    // this.simulation.alpha(1)
    // // Run the first few ticks of the simulation before we start drawing:
    // // "Note that tick events are not dispatched when simulation.tick is called manually"
    // d3.range(10).forEach(this.simulation.tick)
    // this.simulation.restart()
  }

  public restart() {
    this.simulation.alphaTarget(0.8).restart()
  }

  public stop() {
    this.simulation.alphaTarget(0)
  }
}
