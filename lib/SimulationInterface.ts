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

export interface SimulationNode {
  /**
   * unique node id
   */
  id: string

  /**
   * initial seed x position. Should w name this as
   */
  x: number

  /**
   * initial seed y position
   */
  y: number
}

export interface SimulationLink {
  source: string
  target: string
}

export interface SimulationData {
  nodes: SimulationNode[],
  links: SimulationLink[],
}

export interface VisualNode {
  /**
   * Unique node id
   */
  id: string

  /**
   * inactive is a boolean that makes a node grey when set.
   * TODO: this has to be deprecated soon. see TODO above.
   */
  inactive?: boolean

  /**
   * node fill color hex string or hex number
   */
  fill?: number | string

  /**
   * The node container's absolute size in pixels at the default zoom level
   * TODO: This is a bad name. We need to make more sense of this by ensuring all visual attributes
   * can be translated represented by a property name in VisualGraphNode. e.g. scale.
   */
  size?: number

  /**
   * node strike color hex string or hex number
   */
  stroke?: number | string

  /**
   * relative node stroke opacity (must be between 0.0 to 1.0)
   */
  strokeOpacity?: number

  /**
   * relative node stroke width (must be between 0.0 to 1.0)
   */
  strokeWidth?: number
}

export interface VisualLink {
  source: string
  target: string

  /**
   * determines whether an arrow is drawn on the link
   */
  directed?: string

  /**
   * hex color string or hex number
   */
  color: string | number
}

type GraphNode = VisualNode & SimulationNode
type GraphLink = VisualLink & SimulationLink

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}
