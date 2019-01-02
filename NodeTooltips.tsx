import * as React from 'react'
import {CSSProperties} from 'react'
import * as THREE from 'three'
import {VisualGraphNode} from './lib/sans-sim/GraphVisualization'

export const getNodeWithScreenSpaceCoords = (
  node: VisualGraphNode,
  camera: THREE.OrthographicCamera,
  canvasWidth: number,
  canvasHeight: number,
) => {
  if (!node) {
    return null
  }

  const pos = new THREE.Vector3(node.x, node.y, 0)
  pos.project(camera)

  return {
    ...node,
    screenX: THREE.Math.mapLinear(pos.x, -1, 1, 0, canvasWidth),
    screenY: THREE.Math.mapLinear(pos.y, 1, -1, 0, canvasHeight),
  }
}

const getTooltipStyle = (node: VisualGraphNode, isPrimary?: boolean): CSSProperties => {
  // TOOD: fix node size
  const offsetTop = isPrimary ? -20 : -10
  const offsetLeft = isPrimary ? 25 : 10
  return ({
    float: 'left',
    left: node.screenX + offsetLeft,
    position: 'absolute',
    top: node.screenY + offsetTop,
    zIndex: isPrimary ? 10 : 9,
    fontSize: 12,
  })
}

interface Props {
  primaryNode: VisualGraphNode | null,
  camera: THREE.OrthographicCamera,
  canvasWidth: number,
  canvasHeight: number,
}

export class NodeTooltips extends React.Component<Props> {
  public props: Props
  public render() {
    const {primaryNode, camera, canvasWidth, canvasHeight} = this.props

    if (!primaryNode) {
      return null
    }

    const n = getNodeWithScreenSpaceCoords(primaryNode, camera, canvasWidth, canvasHeight)
    if (!n) {
      return null
    }

    return (
      <div style={getTooltipStyle(n)}>
        <div>{n.displayName}</div>
      </div>
    )
  }
}
