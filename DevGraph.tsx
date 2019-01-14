import {Empty} from '@core/wrappers_pb'
import {PersistenceServiceClient} from '@core/services/persistence_service_pb_service'
import {Button, createStyles, Paper, Theme, Typography, WithStyles, withStyles} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import * as React from 'react'
import {PERSISTENCE_SERVICE_ADDRESS} from '../App'
import {GraphVisualization} from './lib/GraphVisualization'
import {NodeTooltips, TooltipNode} from './NodeTooltips'
import {toVisualGraphData} from './vizUtils'

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'relative',
  },
  canvas: {
    background: 'white',
  },
  refreshButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  errorMessage: {
    position: 'absolute',
    top: 0,
    left: theme.spacing.unit,
    color: 'red',
  },
})

interface State {
  readonly tooltipNode: TooltipNode | null
  readonly errorMessage?: string
}

interface Props extends WithStyles<typeof styles> {
  width: number
  height: number
}

class DevGraphBase extends React.Component<Props, State> {
  client = new PersistenceServiceClient(PERSISTENCE_SERVICE_ADDRESS)
  graphVisualization: GraphVisualization

  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  readonly state: State = {
    tooltipNode: null,
  }

  componentDidMount(): void {
    const canvas = this.canvasRef.current! // this is safe when mounted
    this.graphVisualization = new GraphVisualization(
      {nodes: [], links: []},
      canvas,
      this.props.width,
      this.props.height,
    )
    this.graphVisualization.onHover = this.onNodeHover

    this.readGraph()
  }

  onNodeHover = (hoveredNode: TooltipNode | null) => {
    this.setState({tooltipNode: hoveredNode})
  }

  readGraph = (): void => {
    this.setState({errorMessage: undefined})

    this.client.readAllEvents(new Empty(), (error, response) => {
      if (error) {
        console.error(error) // tslint:disable-line no-console
        this.setState({errorMessage: `Error reading graph: ${error.message || 'unknown error'}`})
        return
      }

      if (!response) {
        this.setState({errorMessage: 'Error reading graph: received no response'})
        return
      }

      this.graphVisualization.update(toVisualGraphData(response.getValuesList()))
    })
  }

  render() {
    const {classes} = this.props

    return (
      <Paper className={classes.root}>
        <canvas ref={this.canvasRef} className={classes.canvas}/>

        <NodeTooltips node={this.state.tooltipNode}/>

        <Button
          size={'small'}
          onClick={this.readGraph}
          className={classes.refreshButton}
        >
          <RefreshIcon />
        </Button>

        {this.state.errorMessage &&
          <Typography className={classes.errorMessage}>
            {this.state.errorMessage}
          </Typography>
        }
      </Paper>
    )
  }
}

export const DevGraph = withStyles(styles)(DevGraphBase)
