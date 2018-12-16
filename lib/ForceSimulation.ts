import * as d3 from 'd3'
import {SimLink, Simulation, VisualGraphData} from './GraphVisualization'

class ForceSimulation {
  constructor(graph: VisualGraphData) {
    return d3.forceSimulation(graph.nodes)
      .force('links', d3.forceLink(graph.links).id((e: SimLink) => e.id).distance(1).strength(1.0))
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0))
      .force('charge', d3.forceManyBody().strength(-100))
      .velocityDecay(0.7) as Simulation
  }
}
