import {VisualGraphData} from './GraphVisualization'

// Interface that any custom layout / force simulation class should implement
export interface SimulationInterface {
  /**
   * Seeds the simulation with data
   */
  initialize: (graphData: VisualGraphData) => void
  /**
   * Handler to bind a callback function to the simulation's tick event
   */
  onSimulationTick: (callback: (graphData: VisualGraphData) => void) => void
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
   * Adds entropy to the simulation and restarts it.
   * The caller should not expect the entropy of the simulation to settle and will have to manually call `stop()` after
   * any call to this function.
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
