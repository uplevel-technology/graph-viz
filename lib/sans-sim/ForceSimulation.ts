import * as d3 from 'd3'
import {findIndex, merge, reduce} from 'lodash'
import {VisualGraphData, VisualGraphLink, VisualGraphNode} from './GraphVisualization'

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

type SimulationNode = VisualGraphNode & d3.SimulationNodeDatum
type SimulationLink = VisualGraphLink & d3.SimulationLinkDatum<SimulationNode>
type D3Simulation = d3.Simulation<SimulationNode, SimulationLink>

// This interface is compatible with VisualGraphData
export interface SimulationInput {
  nodes: SimulationNode[],
  links: SimulationLink[],
}

export class ForceSimulation {
  private simulation: D3Simulation
  private onSimulationTick: (graphData: VisualGraphData) => {}

  constructor(graphData: SimulationInput, onSimulationTick: (graphData: VisualGraphData) => {}) {
    this.onSimulationTick = onSimulationTick
    const linksWithIds = graphData.links.map(l => ({source: l.source.id, target: l.target.id}))

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
    const newNodes = mergeById(this.simulation.nodes(), graph.nodes)
    const newLinks = mergeById(
      (this.simulation.force('links') as d3.ForceLink<SimulationNode, SimulationLink>).links(),
      graph.links,
    )

    const linksWithIds = newLinks.map(l => ({source: l.source.id, target: l.target.id}))

    this.simulation
      .nodes(newNodes)
      .force('links', d3.forceLink(linksWithIds).id((n: SimulationNode) => n.id))

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
