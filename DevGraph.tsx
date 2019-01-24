import {PersistenceServiceClient} from '@core/services/persistence_service_pb_service'
import {Empty} from '@core/wrappers_pb'
import {Button, createStyles, Paper, Theme, Typography, WithStyles, withStyles} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import * as React from 'react'
import {PERSISTENCE_SERVICE_ADDRESS} from '../App'
import {BasicForceSimulation, ForceSimulationNode} from './lib/BasicForceSimulation'
import {GraphVizData, NextGraphVisualization} from './lib/NextGraphVisualization'
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
  visualization: NextGraphVisualization
  vizData: GraphVizData = {
    nodes: [],
    links: [],
  }
  simulation: BasicForceSimulation

  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  readonly state: State = {
    tooltipNode: null,
  }

  componentDidMount(): void {
    const canvas = this.canvasRef.current! // this is safe when mounted
    this.visualization = new NextGraphVisualization(
      this.vizData,
      canvas,
      this.props.width,
      this.props.height,
    )
    this.simulation = new BasicForceSimulation(this.vizData)

    this.visualization.onNodeHoverIn((hoveredNodeIdx: number) => {
      const hoveredNode = this.vizData.nodes[hoveredNodeIdx]
      const screenCoords = this.visualization.toScreenSpacePoint(hoveredNode.x, hoveredNode.y)
      const tooltipNode = {
        ...hoveredNode,
        displayName: 'Name',
        displayType: 'Type',
        formattedTime: 'Time',
        screenX: screenCoords.x,
        screenY: screenCoords.y,
      }
      this.setState({tooltipNode})
    })

    this.visualization.onNodeHoverOut(() => {
      this.setState({tooltipNode: null})
    })

    this.visualization.onClick(((worldSpaceMousePosition, clickedNodeIdx) => {
      if (clickedNodeIdx === null) {
        return
      }

      const node = this.vizData.nodes[clickedNodeIdx] as ForceSimulationNode
      if (node.fx) {
        // release node
        node.fx = null
        node.fy = null

        // TODO reset node stroke
      } else {
        node.fx = node.x
        node.fy = node.y

        // TODO add highlighted node stroke
      }
    }))

    this.visualization.onNodeDrag(((worldPos, draggedNodeIdx) => {
      const node = this.vizData.nodes[draggedNodeIdx] as ForceSimulationNode
      node.x = worldPos.x
      node.y = worldPos.y
      node.fx = node.x
      node.fy = node.y

      // TODO add highlighted node stroke

      this.visualization.updateNode(draggedNodeIdx)
    }))

    this.visualization.onDragStart((mouse, draggedNodeIdx: number|null) => {
      if (draggedNodeIdx !== null) {
        this.simulation.reheat()
      }
    })

    this.visualization.onDragEnd(this.simulation.stop)

    this.readGraph()
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

      this.visualization.update(toVisualGraphData(response.getValuesList())) // <- FIXME
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
