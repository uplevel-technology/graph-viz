import {GraphVizNode} from './GraphVizComponent'
import {NODE_DEFAULTS} from '@graph-viz/core/lib/Nodes'

export const LOCKED_NODE_STROKE_WIDTH = 0.3
export const LOCKED_NODE_STROKE_OPACITY = 0.4
export const HOVERED_NODE_SCALE = 1.5

interface Vec2 {
  x: number
  y: number
}

export const toggleNodeLock = (node: GraphVizNode, newPos?: Vec2): void => {
  if (node.fx) {
    unlockNode(node)
  } else {
    lockNode(node, newPos)
  }
}

export const lockNode = (node: GraphVizNode, newPos?: Vec2): void => {
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

export const unlockNode = (node: GraphVizNode): void => {
  node.fx = null
  node.fy = null

  node.strokeWidth = NODE_DEFAULTS.strokeWidth
  node.strokeOpacity = NODE_DEFAULTS.strokeOpacity
}

export const magnifyNode = (node: GraphVizNode): void => {
  node.scale = HOVERED_NODE_SCALE
}

export const resetNodeScale = (node: GraphVizNode): void => {
  node.scale = NODE_DEFAULTS.scale
}
