/**
 * TODO: maintain a map of color names to their hex codes in addition to the fill and outline palettes below
 *
 * TODO:
 * additional colors from kaori (fill, then outline)
 * Yellow fill:    #FFD74F
 * Yellow outline: #FF8A3A
 *
 * NOTE: For now the keys corresponding to specific attribute types must match the labels in
 * neo4j (for the microsoft data, that's snake_case)
 */
import * as THREE from 'three'
import {ForceSimulationNode} from './lib/BasicForceSimulation'
import {
  DEFAULT_NODE_SCALE,
  DEFAULT_NODE_STROKE_OPACITY,
  DEFAULT_NODE_STROKE_WIDTH,
  GraphVizNode,
  HOVERED_NODE_SCALE,
  LOCKED_NODE_STROKE_OPACITY,
  LOCKED_NODE_STROKE_WIDTH,
} from './lib/Nodes'

export const NodeFillPalette: {[key: string]: string} = {
  artifact: '#00478D',
  attribute: '#FEC400',
  alert: '#F16576', // red
  emailUpload: '#0d8721',
  ipAddress: '#86B4EA', // blue
  port: '#CFDEFF', // light blue
  filePath: '#EED6F2', // pink
  filename: '#A68ABE', // purple
  hash: '#C0F3FA', // cyan
  url: '#7ED3C0', // green
  application: '#CCFF90', // light green
  process: '#FFA76B', // orange
}

export const NodeOutlinePalette: {[key: string]: string} = {
  artifact: '#00478D',
  attribute: '#FEC400',
  alert: '#921928', // red
  emailUpload: '#0d8721',
  ipAddress: '#005DB8', // blue
  port: '#5986EC', // light blue
  filePath: '#EA80FC', // pink
  filename: '#5B129B', // purple
  hash: '#08A7BB', // cyan
  url: '#278C90', // green
  application: '#9ACA95', // light green
  process: '#FC6600', // orange
}

export const toggleNodeLock = (
  node: Partial<ForceSimulationNode & GraphVizNode>,
  newPos?: THREE.Vector3,
): void => {
  if (node.fx) {
    unlockNode(node)
  } else {
    lockNode(node, newPos)
  }
}

export const lockNode = (
  node: Partial<ForceSimulationNode & GraphVizNode>,
  newPos?: THREE.Vector3,
): void => {
  if (newPos) {
    node.fx = newPos.x
    node.fy = newPos.y
  } else {
    node.fx = node.x
    node.fy = node.y
  }

  node.strokeWidth = LOCKED_NODE_STROKE_WIDTH
  node.strokeOpacity = LOCKED_NODE_STROKE_OPACITY
}

export const unlockNode = (
  node: Partial<ForceSimulationNode & GraphVizNode>,
): void => {
  node.fx = null
  node.fy = null

  node.strokeWidth = DEFAULT_NODE_STROKE_WIDTH
  node.strokeOpacity = DEFAULT_NODE_STROKE_OPACITY
}

export const magnifyNode = (node: Partial<GraphVizNode>): void => {
  node.scale = HOVERED_NODE_SCALE
}

export const resetNodeScale = (node: Partial<GraphVizNode>): void => {
  node.scale = DEFAULT_NODE_SCALE
}
