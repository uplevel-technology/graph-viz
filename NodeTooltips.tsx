import * as React from 'react'
import * as THREE from 'three'
import {SimNode} from './lib/GraphVisualization'
import {CSSProperties} from 'react'
import {get} from 'lodash'

export const getNodeWithScreenSpaceCoords = (
  node: SimNode,
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

const getTooltipStyle = (node: SimNode, isPrimary?: boolean): CSSProperties => {
  // TOOD: fix node size
  const offsetTop = isPrimary ? -20 : -10
  const offsetLeft = isPrimary ? 25 : 10
  return ({
    float: 'left',
    left: node.screenX + offsetLeft,
    position: 'absolute',
    top: node.screenY + offsetTop,
    zIndex: isPrimary ? 10 : 9,
  })
}

interface Props {
  primaryNode: SimNode,
  camera: THREE.OrthographicCamera,
  canvasWidth: number,
  canvasHeight: number,
}

export class NodeTooltips extends React.Component<Props> {
  public props: Props
  public render() {
    const {primaryNode, camera, canvasWidth, canvasHeight} = this.props

    let primaryTooltipStyle
    let label

    if (primaryNode) {
      const n = getNodeWithScreenSpaceCoords(primaryNode, camera, canvasWidth, canvasHeight)
      primaryTooltipStyle = getTooltipStyle(n)
      label = `${get(n, 'type')} (${get(n, 'parentType')})`
    }

    return (
      <div style={primaryTooltipStyle}>
        <div>{label}</div>
      </div>
    )
  }
}
