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

interface State {
  readonly graphViz?: GraphViz.AsObject
  readonly tooltipNode?: any // TODO fix
}

export class DevGraph extends React.Component<State> {
  public graphVizCrudClient: GraphVizCrudServiceClient
  public graphVisualization: GraphVisualization

  public canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  public readonly state: State = {
    tooltipNode: null,
  }

  public componentDidMount(): void {
    this.graphVizCrudClient = new GraphVizCrudServiceClient(GRAPH_CRUD_APP_ADDRESS)

    const canvas = this.canvasRef.current
    this.graphVisualization = new GraphVisualization({nodes: [], links: []}, canvas, 700, 700)
    this.graphVisualization.onHover = this.onNodeHover

    this.readGraphViz()
  }

  public onNodeHover = (hoveredNode: SimNode) => {
    this.setState({tooltipNode: hoveredNode})
  }

  public readGraphViz(): void {
    this.graphVizCrudClient.read(new Empty(), (error: CrudError, graphViz: GraphViz) => {
      if (error) {
        throw error
      }

      const graphVizObject = formatVizData(graphViz.toObject())

      const graph = {
        links: graphVizObject.links.map(transformLink),
        nodes: graphVizObject.nodes.map(transformNode),
      }

      console.log(graph) // tslint:disable-line no-console

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
          canvasWidth={700}
          canvasHeight={700}
        />
      </div>
    )
  }
}
