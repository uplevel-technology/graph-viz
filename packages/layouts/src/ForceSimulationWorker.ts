import {
  FORCE_DEFAULTS,
  ForceConfig,
  ForceSimulationBase,
  NodePosition,
  SimulationData,
} from './ForceSimulationBase'
import {noop} from 'lodash'

export class ForceSimulationWorker extends ForceSimulationBase {
  constructor() {
    super()
  }

  thread = 'worker' as const

  // narrow down type def
  registeredEventHandlers: {
    tick: (progress: number) => void
    stabilized: (nodePositions: NodePosition[]) => void
  } = {
    tick: noop,
    stabilized: noop,
  }

  public initialize(
    graph: SimulationData,
    config: ForceConfig = FORCE_DEFAULTS,
  ) {
    super.initialize(graph, config)
    if (this.simulation) {
      this.simulation.stop()
      this.stabilize()
    }
  }

  // narrow down type def
  public onTick(callback: (progress: number) => void) {
    super.onTick(callback)
  }

  public onStabilize(callback: (nodePositions: NodePosition[]) => void) {
    this.registeredEventHandlers.stabilized = callback
  }

  private stabilize() {
    if (this.simulation) {
      for (
        let i = 0,
          n = Math.ceil(
            Math.log(this.simulation.alphaMin()) /
              Math.log(1 - this.simulation.alphaDecay()),
          );
        i < n;
        ++i
      ) {
        this.registeredEventHandlers.tick(Math.round((i * 10000) / n) / 100)
        this.simulation.tick()
      }
      this.registeredEventHandlers.tick(100)
      this.registeredEventHandlers.stabilized(this.getNodePositions())
    }
  }
}
