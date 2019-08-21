import * as React from 'react'
import {CSSProperties} from 'react'

export interface TooltipFields {
  id: string
  displayName: string
  displayType?: string
  formattedTime?: string
  clusterId?: number
  pattern?: string
}

export interface TooltipNode extends TooltipFields {
  screenX: number
  screenY: number
}

const getTooltipStyle = (node: TooltipNode): CSSProperties => {
  const offsetTop = 30
  const offsetLeft = 0
  return {
    left: node.screenX + offsetLeft,
    top: node.screenY + offsetTop,
    zIndex: 10,
  }
}

const styles = {
  root: {
    maxWidth: 250,
    overflow: 'hidden' as const,
    position: 'absolute' as const,
    fontSize: 12,
    backgroundColor: 'rgb(200,207,214, 0.7)',
    padding: 6,
    borderRadius: 3,
    textTransform: 'capitalize' as const,
    // Disable pointer events on tooltip node
    pointerEvents: 'none' as const,
  },
}

interface Props {
  node: TooltipNode | null
  renderTooltip?: Element | (props) = n
}

export class NodeTooltips extends React.Component<Props> {
  render() {
    if (!this.props.node) {
      return null
    }
    return (
      <div style={{...styles.root, ...getTooltipStyle(this.props.node)}}
      >
        <Grid container direction={'row'} justify={'space-between'}>
          <Grid item>
            {this.props.node.displayType && (
              <Typography style={{fontSize: 10, fontWeight: 'bold'}}>
                {this.props.node.displayType}
              </Typography>
            )}
          </Grid>
          <Grid item>
            {this.props.node.clusterId !== undefined && (
              <Typography
                style={{
                  textTransform: 'none',
                  fontSize: 10,
                  color: '#555555',
                }}
              >
                {`Cluster ${this.props.node.clusterId!}`}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Typography
          variant={'body2'}
          style={{...styles.breakLongWord, ...styles.origCase}}
        >
          {this.props.node.displayName}
        </Typography>
        {this.props.node.formattedTime !== undefined && (
          <Typography style={{fontSize: 10, color: '#555555'}}>
            {this.props.node.formattedTime}
          </Typography>
        )}
        {this.props.node.pattern !== undefined && (
          <Typography
            style={{fontSize: 10, color: '#555555', textTransform: 'none'}}
          >
            {`Matches '${this.props.node.pattern}'`}
          </Typography>
        )}
      </Grid>
    )
  }
}
