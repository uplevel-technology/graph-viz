import {
  ForceSimulation,
  SimulationNode,
  SimulationData,
} from './ForceSimulation'
import * as d3 from 'd3'

export function fixNodePositionsOverScale(
  nodes: SimulationNode[],
  scale: d3.AxisScale<any>,
  axis: 'x' | 'y' = 'x',
  field: string, // todo fix
) {
  return nodes.map(n => ({
    ...n,
    [`f${axis}`]: scale(n[field as keyof SimulationNode]) as number,
  }))
}

export class TimelineSimulation extends ForceSimulation {
  public initialize(
    graph: SimulationData,
    timeField: string,
    range: [number, number],
    domain?: [number | undefined, number | undefined],
    axis: 'x' | 'y' = 'x',
  ) {
    const scale = d3.scaleLinear().domain(domain).range(range)

    super.initialize(graph)
  }
}
