import {GraphVizData} from '@core/services/graph_viz_service_pb'
import {GraphVizServiceClient, ServiceError as GraphVizServiceError} from '@core/services/graph_viz_service_pb_service'
import {Empty} from '@core/wrappers_pb'
import {Button, createStyles, Paper, Theme, Typography, WithStyles, withStyles} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import * as React from 'react'
import {GRAPH_CRUD_APP_ADDRESS} from '../App'
import {GraphVisualization, VisualGraphNode} from './lib/sans-sim/GraphVisualization'
import {formatVizData, transformLink, transformNode} from './vizUtils'

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
  public graphVizCrudClient: GraphVizServiceClient
  public graphVisualization: GraphVisualization

  public canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  public readonly state: State = {tooltipNode: null}

  public componentDidMount(): void {
    this.graphVizCrudClient = new GraphVizServiceClient(GRAPH_CRUD_APP_ADDRESS)

    const canvas = this.canvasRef.current! // this is safe when mounted
    this.graphVisualization = new GraphVisualization(
      {nodes: [], links: []},
      canvas,
      this.props.width,
      this.props.height,
    )
    this.graphVisualization.onHover = this.onNodeHover

    this.readGraphViz()
  }

  public onNodeHover = (hoveredNode: VisualGraphNode | null) => {
    this.setState({tooltipNode: hoveredNode})
  }

  public readGraphViz = (): void => {
    this.setState({errorMessage: undefined})

    this.graphVizCrudClient.read(new Empty(), (error: GraphVizServiceError|null, graphViz: GraphVizData|null) => {
      if (error) {
        console.error(error) // tslint:disable-line no-console
        this.setState({errorMessage: `Error retrieving graph: ${error.message || 'unknown error'}`})
        return
      }

      if (!graphViz) {
        this.setState({errorMessage: 'Error retrieving graph: received no graphViz response'})
        return
      }

      const graphVizObject = formatVizData(graphViz)
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
          onClick={this.readGraphViz}
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
