import {
  FORCE_DEFAULTS,
  ForceConfig,
  ForceSimulationBase,
  NodePosition,
  SimulationData,
} from './ForceSimulationBase'
import {noop} from 'lodash'

export class ForceSimulationWorker extends ForceSimulationBase {
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
  public onTick(callback: (nodePositions: NodePosition[]) => void) {
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
        this.registeredEventHandlers.tick(i / n)
        this.simulation.tick()
      }
      this.registeredEventHandlers.stabilized(this.getNodePositions())
      // for (let i = 0, n = 300; i < n; ++i) {
      //   this.simulation.tick()
      // }
    }
  }
}
