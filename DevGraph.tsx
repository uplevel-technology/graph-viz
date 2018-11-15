import * as React from 'react'
import {get} from 'lodash'
import {GraphViz} from '@core/ontology/graph_viz_pb'
import {
  GraphVizCrudServiceClient,
  ServiceError as CrudError,
} from '@core/services/crud/crud_services_pb_service'
import {GraphVisualization, SimNode} from './lib/GraphVisualization'
import {GRAPH_CRUD_APP_ADDRESS} from '../../src/App'
import {NodeTooltips} from './NodeTooltips'
import {formatVizData, transformLink, transformNode} from './vizUtils'
import {Empty} from '@core/services/wrappers_pb'
import {Button, Typography} from '@material-ui/core'

interface State {
  readonly tooltipNode?: SimNode
  readonly errorMessage?: string
}

interface Props {
  width: number
  height: number
}

export class DevGraph extends React.Component<Props, State> {
  public graphVizCrudClient: GraphVizCrudServiceClient
  public graphVisualization: GraphVisualization

  public canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  public readonly state: State = {}

  public componentDidMount(): void {
    this.graphVizCrudClient = new GraphVizCrudServiceClient(GRAPH_CRUD_APP_ADDRESS)

    const canvas = this.canvasRef.current
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
    this.setState({errorMessage: null})

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
    return (
      <div style={{position: 'relative'}}>
        <canvas ref={this.canvasRef} style={{background: 'white'}}/>

        <NodeTooltips
          primaryNode={this.state.tooltipNode}
          camera={get(this.graphVisualization, 'camera')}
          canvasWidth={this.props.width}
          canvasHeight={this.props.height}
        />

        <Button
          size={'small'}
          onClick={this.readGraphViz}
          style={{position: 'absolute', top: 0, right: 0}}
        >
          Refresh
        </Button>

        {this.state.errorMessage &&
          <Typography style={{color: 'red', position: 'absolute', bottom: 0, left: 0}}>
            {this.state.errorMessage}
          </Typography>
        }
      </div>
    )
  }
}
