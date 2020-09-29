import {
  FORCE_DEFAULTS,
  ForceConfig,
  ForceSimulationBase,
  NodePosition,
  SimulationData,
} from './ForceSimulationBase'
import {noop} from 'lodash'

export class ForceSimulation extends ForceSimulationBase {
  thread = 'main' as const

  // narrow down type def
  registeredEventHandlers: {
    tick: (nodePositions: NodePosition[]) => void
  } = {
    tick: noop,
  }

  public initialize(
    graph: SimulationData,
    config: ForceConfig = FORCE_DEFAULTS,
  ) {
    super.initialize(graph, config)
    if (this.simulation) {
      this.simulation.on('tick', () => {
        this.registeredEventHandlers.tick(this.getNodePositions())
      })
    }
  }

  // narrow down type def
  public onTick(callback: (nodePositions: NodePosition[]) => void) {
    super.onTick(callback)
  }
}
