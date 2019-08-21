import {
  DEFAULT_NODE_SCALE,
  DEFAULT_NODE_STROKE_OPACITY,
  DEFAULT_NODE_STROKE_WIDTH,
  HOVERED_NODE_SCALE,
  LOCKED_NODE_STROKE_OPACITY,
  LOCKED_NODE_STROKE_WIDTH,
} from '../../core/src/Nodes'
import {GraphVizNode} from './GraphVizComponent'

interface Vec2 {
  x: number
  y: number
}

export const toggleNodeLock = (
  node: GraphVizNode,
  newPos?: Vec2,
): void => {
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

  node.strokeWidth = DEFAULT_NODE_STROKE_WIDTH
  node.strokeOpacity = DEFAULT_NODE_STROKE_OPACITY
}

export const magnifyNode = (node: GraphVizNode): void => {
  node.scale = HOVERED_NODE_SCALE
}

export const resetNodeScale = (node: GraphVizNode): void => {
  node.scale = DEFAULT_NODE_SCALE
}
