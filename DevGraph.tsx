import * as React from 'react'
import {Button, createStyles, Paper, Theme, Typography, WithStyles, withStyles} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import {GraphVisualization, VisualGraphNode} from './lib/sans-sim/GraphVisualization'
import {formatVizData, transformLink, transformNode} from './vizUtils'
import {Empty} from '@core/wrappers_pb'
import {EventServiceClient} from '@core/services/event_service_pb_service'
import {EVENT_SERVICE_ADDRESS} from '../App'

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
  readonly tooltipNode: VisualGraphNode | null
  readonly errorMessage?: string
}

interface Props extends WithStyles<typeof styles> {
  width: number
  height: number
}

class DevGraphBase extends React.Component<Props, State> {
  public client = new EventServiceClient(EVENT_SERVICE_ADDRESS)
  public graphVisualization: GraphVisualization

  public canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  public readonly state: State = {tooltipNode: null}

  public componentDidMount(): void {
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

  public onNodeHover = (hoveredNode: VisualGraphNode | null) => {
    this.setState({tooltipNode: hoveredNode})
  }

  public readGraph = (): void => {
    this.setState({errorMessage: undefined})

    this.client.readEverything(new Empty(), (error, response) => {
      if (error) {
        console.error(error) // tslint:disable-line no-console
        this.setState({errorMessage: `Error reading graph: ${error.message || 'unknown error'}`})
        return
      }

      if (!response) {
        this.setState({errorMessage: 'Error reading graph: received no response'})
        return
      }

      const graphVizObject = formatVizData(response)
      const graph = {
        links: graphVizObject.links.map(transformLink),
        nodes: graphVizObject.nodes.map(transformNode),
      }

      this.graphVisualization.update(graph)
    })
  }

  public render() {
    const {classes, width, height} = this.props

    return (
      <Paper className={classes.root}>
        <canvas ref={this.canvasRef} className={classes.canvas}/>

        {/*<NodeTooltips*/}
          {/*primaryNode={this.state.tooltipNode}*/}
          {/*camera={get(this.graphVisualization, 'camera')}*/}
          {/*canvasWidth={width}*/}
          {/*canvasHeight={height}*/}
        {/*/>*/}

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
