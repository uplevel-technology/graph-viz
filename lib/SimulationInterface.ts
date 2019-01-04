import {VisualGraphData} from './GraphVisualization'

// Interface that any custom layout / force simulation class should implement
export interface SimulationInterface {
  /**
   * Seeds the simulation with data
   */
  initialize: (graphData: VisualGraphData) => void
  /**
   * Updates the simulation data
   */
  update: (graphData: VisualGraphData) => void
  /**
   * Restarts the simulation.
   * The caller should expect the entropy of the simulation to automatically settle after calling this function.
   */
  restart: () => void
  /**
   * Adds entropy to the simulation and restart it.
   * The caller should not expect the entropy of the simulation to settle and will have to call stop after any
   * call to this function.
   */
  reheat: () => void
  /**
   * Should set the simulation entropy to zero and stop emitting tick events and stop all computations.
   */
  stop: () => void
  /**
   * Get the simulated VisualGraphData with x, y and other relevant coordinates populated
   */
  getVisualGraph: () => VisualGraphData
}
