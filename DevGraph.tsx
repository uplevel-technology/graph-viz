import {PersistenceServiceClient} from '@core/services/persistence_service_pb_service'
import {Empty} from '@core/wrappers_pb'
import {
  Button,
  createStyles,
  Paper,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import * as React from 'react'
import {PERSISTENCE_SERVICE_ADDRESS} from '../App'
import {
  BasicForceSimulation,
  ForceSimulationData,
  ForceSimulationNode,
  NodePosition,
} from './lib/BasicForceSimulation'
import {GraphVisualization, GraphVizData} from './lib/GraphVisualization'
import {GraphVizLink} from './lib/Links'
import {NodeTooltips, TooltipNode} from './NodeTooltips'
import {eventsToVizData} from './protoToNodeUtils'
import {lockNode, magnifyNode, resetNodeScale, toggleNodeLock} from './vizUtils'

const styles = (theme: Theme) =>
  createStyles({
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
  readonly currentlyHoveredIdx: number | null
  readonly errorMessage?: string
}

interface Props extends WithStyles<typeof styles> {
  width: number
  height: number
}

class DevGraphBase extends React.Component<Props, State> {
  client = new PersistenceServiceClient(PERSISTENCE_SERVICE_ADDRESS)
  visualization: GraphVisualization
  vizData: GraphVizData = {
    nodes: [],
    links: [],
  }
  tooltipNodeList: TooltipNode[]
  simulation: BasicForceSimulation

  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  readonly state: State = {
    tooltipNode: null,
    currentlyHoveredIdx: null,
  }

  componentDidMount(): void {
    const canvas = this.canvasRef.current! // this is safe when mounted
    this.visualization = new GraphVisualization(
      this.vizData,
      canvas,
      this.props.width,
      this.props.height,
    )

    this.simulation = new BasicForceSimulation()
    this.visualization.onNodeHoverIn((hoveredNodeIdx: number) => {
      const vizNode = this.vizData.nodes[hoveredNodeIdx]
      const screenCoords = this.visualization.toScreenSpacePoint(
        vizNode.x,
        vizNode.y,
      )

      magnifyNode(vizNode)

      this.visualization.updateNode(hoveredNodeIdx, vizNode)

      this.setState({
        tooltipNode: {
          ...this.tooltipNodeList[hoveredNodeIdx],
          screenX: screenCoords.x,
          screenY: screenCoords.y,
        },
        currentlyHoveredIdx: hoveredNodeIdx,
      })
    })

    this.simulation.onTick((nodePositions: NodePosition[]) => {
      this.vizData.nodes.forEach((node, i) => {
        node.x = nodePositions[i].x
        node.y = nodePositions[i].y
      })
      this.visualization.updatePositions(this.vizData) // fixme use updatePosition + updateSize
    })

    this.visualization.onNodeHoverOut(hoveredOutNodeIdx => {
      const hoveredOutNode = this.vizData.nodes[hoveredOutNodeIdx]
      resetNodeScale(hoveredOutNode)
      this.visualization.updateNode(hoveredOutNodeIdx, hoveredOutNode)

      // only hide tooltip if currently shown tooltip is hovered out
      if (hoveredOutNodeIdx === this.state.currentlyHoveredIdx) {
        this.setState({tooltipNode: null, currentlyHoveredIdx: null})
      }
    })

    this.visualization.onClick((worldPos, clickedNodeIdx) => {
      if (clickedNodeIdx === null) {
        return
      }
      toggleNodeLock(this.vizData.nodes[clickedNodeIdx])

      this.simulation.update(this.vizData)
      this.visualization.updateNode(
        clickedNodeIdx,
        this.vizData.nodes[clickedNodeIdx],
      )
    })

    this.visualization.onNodeDrag((worldPos, draggedNodeIdx) => {
      const node = this.vizData.nodes[draggedNodeIdx] as ForceSimulationNode
      node.x = worldPos.x
      node.y = worldPos.y
      node.fx = worldPos.x
      node.fy = worldPos.y
      this.simulation.update(this.vizData)
      // ^ the simulation tick handler should handle the position updates after this in our viz
    })

    this.visualization.onDragStart((mouse, draggedNodeIdx: number | null) => {
      if (draggedNodeIdx === null) {
        return
      }

      lockNode(this.vizData.nodes[draggedNodeIdx])

      this.visualization.updateNode(
        draggedNodeIdx,
        this.vizData.nodes[draggedNodeIdx],
      )
      this.simulation.reheat()
    })

    this.visualization.onDragEnd(() => {
      this.simulation.settle()
    })

    this.readGraph()
  }

  readGraph = () => {
    this.setState({errorMessage: undefined})

    this.client.readAllEvents(new Empty(), (error, response) => {
      if (error) {
        console.error(error) // tslint:disable-line no-console
        this.setState({
          errorMessage: `Error reading graph: ${error.message ||
            'unknown error'}`,
        })
        return
      }

      if (!response) {
        this.setState({
          errorMessage: 'Error reading graph: received no response',
        })
        return
      }

      const data = eventsToVizData(response.getValuesList())
      this.tooltipNodeList = data.tooltips as TooltipNode[]

      this.simulation.initialize(data as ForceSimulationData)
      const nodePositions = this.simulation.getNodePositions()

      this.vizData = {
        nodes: data.nodes.map((node, i) => ({
          ...nodePositions[i],
          ...node,
        })),
        links: data.links as GraphVizLink[],
      }
      this.visualization.update(this.vizData)
    })
  }

  render() {
    const {classes} = this.props

    return (
      <Paper className={classes.root}>
        <canvas ref={this.canvasRef} className={classes.canvas} />

        <NodeTooltips node={this.state.tooltipNode} />

        <Button
          size={'small'}
          onClick={this.readGraph}
          className={classes.refreshButton}
        >
          <RefreshIcon />
        </Button>

        {this.state.errorMessage && (
          <Typography className={classes.errorMessage}>
            {this.state.errorMessage}
          </Typography>
        )}
      </Paper>
    )
  }
}

export const DevGraph = withStyles(styles)(DevGraphBase)
