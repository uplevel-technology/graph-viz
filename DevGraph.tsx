import {PersistenceServiceClient} from '@core/services/persistence_service_pb_service'
import {Empty} from '@core/wrappers_pb'
import {Button, createStyles, Paper, Theme, Typography, WithStyles, withStyles} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import * as React from 'react'
import {PERSISTENCE_SERVICE_ADDRESS} from '../App'
import {BasicForceSimulation, ForceSimulationData, ForceSimulationNode, NodePosition} from './lib/BasicForceSimulation'
import {GraphVizData, NextGraphVisualization} from './lib/NextGraphVisualization'
import {GraphVizLink} from './lib/NextLinks'
import {GraphVizNode} from './lib/NextNodes'
import {NodeTooltips, TooltipNode} from './NodeTooltips'
import {getAllVizData} from './vizUtils'

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
  readonly tooltipNodeIdx: number | null
  readonly errorMessage?: string
}

interface Props extends WithStyles<typeof styles> {
  width: number
  height: number
}

class DevGraphBase extends React.Component<Props, State> {
  client = new PersistenceServiceClient(PERSISTENCE_SERVICE_ADDRESS)
  visualization: NextGraphVisualization
  vizData: GraphVizData = {
    nodes: [],
    links: [],
  }
  tooltipNodeList: TooltipNode[]
  simulation: BasicForceSimulation

  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  readonly state: State = {
    tooltipNode: null,
    tooltipNodeIdx: null,
  }

  componentDidMount(): void {
    const canvas = this.canvasRef.current! // this is safe when mounted
    this.visualization = new NextGraphVisualization(
      this.vizData,
      canvas,
      this.props.width,
      this.props.height,
    )

    this.simulation = new BasicForceSimulation()
    this.visualization.onNodeHoverIn((hoveredNodeIdx: number) => {
      const vizNode = this.vizData.nodes[hoveredNodeIdx]
      const screenCoords = this.visualization.toScreenSpacePoint(vizNode.x, vizNode.y)

      this.setState({
        tooltipNode: {
          ...this.tooltipNodeList[hoveredNodeIdx],
          screenX: screenCoords.x,
          screenY: screenCoords.y,
        },
        tooltipNodeIdx: hoveredNodeIdx,
      })
    })

    this.simulation.onTick((nodePositions: NodePosition[]) => {
      this.vizData.nodes.forEach((node, i) => {
        node.x = nodePositions[i].x
        node.y = nodePositions[i].y
        // TODO increase node scale / magnify
      })
      this.visualization.updatePositions(this.vizData) // fixme use updatePosition + updateSize
    })

    this.visualization.onNodeHoverOut((hoveredOutNodeIdx) => {
      if (hoveredOutNodeIdx === this.state.tooltipNodeIdx) {
        this.setState({tooltipNode: null, tooltipNodeIdx: null})
      }
    })

    this.visualization.onClick(((worldPos, clickedNodeIdx) => {
      if (clickedNodeIdx === null) {
        return
      }
      //
      const node = this.vizData.nodes[clickedNodeIdx] as ForceSimulationNode
      const vizNode = this.vizData.nodes[clickedNodeIdx] as GraphVizNode
      if (node.fx) {
        // release node
        node.fx = null
        node.fy = null

        vizNode.strokeWidth = 0.03
        vizNode.strokeOpacity = 1.0
      } else {
        node.fx = worldPos.x
        node.fy = worldPos.y

        vizNode.strokeWidth = 0.3
        vizNode.strokeOpacity = 0.4
      }

      this.simulation.update(this.vizData)

      this.visualization.update(this.vizData)
      // ^^ TODO implement the following instead (because the tick handler should automatically update the positions)
      // this.visualization.updateStroke(this.vizData)
    }))

    this.visualization.onNodeDrag(((worldPos, draggedNodeIdx) => {
      const node = this.vizData.nodes[draggedNodeIdx] as ForceSimulationNode
      node.x = worldPos.x
      node.y = worldPos.y
      node.fx = worldPos.x
      node.fy = worldPos.y
      this.simulation.update(this.vizData)
      // ^ the simulation tick handler should handle the position updates after this in our viz
    }))

    this.visualization.onDragStart((mouse, draggedNodeIdx: number|null) => {
      if (draggedNodeIdx === null) {
        return
      }

      const node = this.vizData.nodes[draggedNodeIdx]
      node.strokeWidth = 0.3
      node.strokeOpacity = 0.4

      this.visualization.update(this.vizData) // FIXME
      // TODO: implement following instead
      // this.visualization.updateStroke(this.vizData)

      this.simulation.reheat()
    })

    this.visualization.onDragEnd(() => {
      this.simulation.stop()
    })

    this.readGraph()
  }

  readGraph = () => {
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

      const data = getAllVizData(response.getValuesList())
      const graphData = data.graphData
      this.tooltipNodeList = data.tooltipsNodes as TooltipNode[]

      this.simulation.initialize(graphData as ForceSimulationData)
      const nodePositions = this.simulation.getNodePositions()

      this.vizData = {
        nodes: graphData.nodes.map((node, i) => ({...nodePositions[i], ...node})),
        links: graphData.links as GraphVizLink[],
      }
      this.visualization.update(this.vizData)
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
