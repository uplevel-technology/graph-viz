import {createStyles, Grid, Theme, Typography, withStyles, WithStyles} from '@material-ui/core'
import * as React from 'react'
import {CSSProperties} from 'react'

export interface TooltipNode {
  id: string
  displayName: string
  displayType?: string
  formattedTime?: string
  screenX: number
  screenY: number
}

const getTooltipStyle = (node: TooltipNode): CSSProperties => {
  const offsetTop = -10
  const offsetLeft = 10
  return ({
    left: node.screenX + offsetLeft,
    top: node.screenY + offsetTop,
    zIndex: 10,
  })
}

const styles = (theme: Theme) => createStyles({
  root: {
    maxWidth: 250,
    overflow: 'hidden',
    position: 'absolute',
    fontSize: 12,
    backgroundColor: 'rgb(200,207,214, 0.7)',
    padding: 6,
    borderRadius: 3,
    textTransform: 'capitalize',
  },
  breakLongWord: {
    wordBreak: 'break-word',
  },
})

interface Props extends WithStyles<typeof styles> {
  node: TooltipNode | null,
}

class NodeTooltipsBase extends React.Component<Props> {
  render() {
    const {classes} = this.props
    if (!this.props.node) {
      return null
    }
    return (
      <Grid container direction={'column'} className={classes.root} style={getTooltipStyle(this.props.node)}>
        {this.props.node.displayType &&
          <Typography style={{fontSize: 10, fontWeight: 'bold'}}>{this.props.node.displayType}</Typography>
        }
        <Typography variant={'body2'} className={classes.breakLongWord}>{this.props.node.displayName}</Typography>
        {this.props.node.formattedTime &&
          <Typography style={{fontSize: 10, color: '#555555'}}>{this.props.node.formattedTime}</Typography>
        }
      </Grid>
    )
  }
}

export const NodeTooltips = withStyles(styles)(NodeTooltipsBase)
