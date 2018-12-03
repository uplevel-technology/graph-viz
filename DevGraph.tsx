import * as React from 'react'
import {
  createStyles,
  Button,
  Theme,
  Typography,
  withStyles,
  WithStyles,
  Paper,
} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import {get} from 'lodash'
import {GraphViz} from '@core/ontology/graph_viz_pb'
import {
  GraphVizCrudServiceClient,
  ServiceError as CrudError,
} from '@core/services/crud/crud_services_pb_service'
import {GraphVisualization, SimNode} from './lib/GraphVisualization'
import {GRAPH_CRUD_APP_ADDRESS} from '../App'
import {NodeTooltips} from './NodeTooltips'
import {formatVizData, transformLink, transformNode} from './vizUtils'
import {Empty} from '@core/services/wrappers_pb'

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
  readonly tooltipNode: SimNode | null
  readonly errorMessage?: string
}

interface Props extends WithStyles<typeof styles> {
  width: number
  height: number
}

class DevGraphBase extends React.Component<Props, State> {
  public graphVizCrudClient: GraphVizCrudServiceClient
  public graphVisualization: GraphVisualization

  public canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  public readonly state: State = {tooltipNode: null}

  public componentDidMount(): void {
    this.graphVizCrudClient = new GraphVizCrudServiceClient(GRAPH_CRUD_APP_ADDRESS)

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

  public onNodeHover = (hoveredNode: SimNode|null) => {
    this.setState({tooltipNode: hoveredNode})
  }

  public readGraphViz = (): void => {
    this.setState({errorMessage: undefined})

    this.graphVizCrudClient.read(new Empty(), (error: CrudError|null, graphViz: GraphViz|null) => {
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

        <NodeTooltips
          primaryNode={this.state.tooltipNode}
          camera={get(this.graphVisualization, 'camera')}
          canvasWidth={width}
          canvasHeight={height}
        />

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
