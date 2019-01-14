import * as React from 'react'
import {CSSProperties} from 'react'

export interface TooltipNode {
  id: string
  displayName: string
  nodeType?: string
  formattedTime?: string
  screenX: number
  screenY: number
}

const getTooltipStyle = (node: TooltipNode, isPrimary?: boolean): CSSProperties => {
  const offsetTop = isPrimary ? -20 : -10
  const offsetLeft = isPrimary ? 25 : 10
  return ({
    float: 'left',
    left: node.screenX + offsetLeft,
    position: 'absolute',
    top: node.screenY + offsetTop,
    zIndex: isPrimary ? 10 : 9,
    fontSize: 12,
    backgroundColor: 'rgb(200,207,214, 0.7)',
    padding: 6,
    borderRadius: 3,
    textTransform: 'capitalize',
  })
}

interface Props {
  node: TooltipNode | null,
}

export class NodeTooltips extends React.Component<Props> {
  render() {
    if (!this.props.node) {
      return null
    }
    return (
      <div style={getTooltipStyle(this.props.node)}>
        <div>
          {this.props.node.nodeType}
        </div>
        <div>
          {this.props.node.displayName}
        </div>
        <div>
          {this.props.node.formattedTime}
        </div>
      </div>
    )
  }
}
