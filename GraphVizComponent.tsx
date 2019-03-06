import {PersistenceServiceClient} from '@core/services/persistence_service_pb_service'
import {
  Button,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import * as React from 'react'
import {PERSISTENCE_SERVICE_ADDRESS} from '../App'
import {
  BasicForceSimulation,
  ForceSimulationData,
  ForceSimulationNode,
  NodePosition,
} from './lib/BasicForceSimulation'
import {
  ConfigurationOptions,
  GraphVisualization,
  GraphVizData,
} from './lib/GraphVisualization'
import {GraphVizLink} from './lib/Links'
import {NodeTooltips, TooltipNode} from './NodeTooltips'
import {lockNode, magnifyNode, resetNodeScale, toggleNodeLock} from './vizUtils'
import {debounce} from 'lodash'
import {GraphVizNode} from './lib/Nodes'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'relative',
      width: '100%',
      height: '100%', // FIXME: fix hardcoded height
    },
    canvas: {
      background: 'white',
    },
    actionButtons: {
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
  readonly currentTooltipNode: TooltipNode | null
  readonly currentlyHoveredIdx: number | null
  readonly errorMessage?: string
}

// A partial GraphVizNode with a required id parameter
// Better naming suggestions welcome
export interface PartialGraphVizNode extends Partial<GraphVizNode> {
  id: string
}

interface Props extends WithStyles<typeof styles> {
  nodes: PartialGraphVizNode[]
  links: GraphVizLink[]
  tooltips: Partial<TooltipNode>[]
  onRefresh?: () => any
  config?: ConfigurationOptions
  showControls?: boolean
}

class GraphVizComponentBase extends React.Component<Props, State> {
  client = new PersistenceServiceClient(PERSISTENCE_SERVICE_ADDRESS)
  visualization: GraphVisualization
  vizData: GraphVizData = {
    nodes: [],
    links: [],
  }
  tooltipNodes: TooltipNode[]
  simulation: BasicForceSimulation

  rootRef: React.RefObject<HTMLDivElement> = React.createRef()
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  readonly state: State = {
    currentTooltipNode: null,
    currentlyHoveredIdx: null,
  }

  onWindowResize = debounce(() => {
    const root = this.rootRef.current!
    const {width, height} = root.getBoundingClientRect()

    this.visualization.resize(width, height)
  }, 500)

  componentDidMount() {
    const canvas = this.canvasRef.current! // this is safe when mounted
    const root = this.rootRef.current!

    this.vizData = {
      nodes: this.props.nodes as GraphVizNode[],
      links: this.props.links as GraphVizLink[],
    }
    this.tooltipNodes = this.props.tooltips as TooltipNode[]

    const {width, height} = root.getBoundingClientRect()
    this.visualization = new GraphVisualization(
      this.vizData,
      canvas,
      width,
      height,
      this.props.config,
    )

    window.addEventListener('resize', this.onWindowResize)

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
        currentTooltipNode: {
          ...this.tooltipNodes[hoveredNodeIdx],
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
        this.setState({currentTooltipNode: null, currentlyHoveredIdx: null})
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

    // Initialize data
    if (this.props.nodes.length > 0) {
      this.initData()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.nodes !== this.props.nodes) {
      this.vizData = {
        nodes: this.props.nodes as GraphVizNode[],
        links: this.props.links as GraphVizLink[],
      }
      this.tooltipNodes = this.props.tooltips as TooltipNode[]

      this.initData()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    this.visualization.dispose()
  }

  initData() {
    this.simulation.initialize(this.props as ForceSimulationData)

    const nodePositions = this.simulation.getNodePositions()
    this.visualization.update({
      nodes: this.props.nodes.map((node, i) => ({
        ...nodePositions[i],
        ...node,
      })),
      links: this.props.links as GraphVizLink[],
    })
  }

  zoomIn = () => {
    this.visualization.zoom(0.2)
  }

  zoomOut = () => {
    this.visualization.zoom(-0.2)
  }

  render() {
    const {classes, onRefresh, showControls} = this.props

    return (
      <div ref={this.rootRef} className={classes.root}>
        <canvas ref={this.canvasRef} className={classes.canvas} />

        <NodeTooltips node={this.state.currentTooltipNode} />

        {showControls && (
          <Grid
            container
            direction={'column'}
            alignItems={'flex-end'}
            className={classes.actionButtons}
          >
            <Button size={'small'} onClick={onRefresh}>
              <RefreshIcon />
            </Button>
            <Button size={'small'} onClick={this.zoomIn}>
              <ZoomInIcon />
            </Button>
            <Button size={'small'} onClick={this.zoomOut}>
              <ZoomOutIcon />
            </Button>
          </Grid>
        )}

        {this.state.errorMessage && (
          <Typography className={classes.errorMessage}>
            {this.state.errorMessage}
          </Typography>
        )}
      </div>
    )
  }
}

export const GraphVizComponent = withStyles(styles)(GraphVizComponentBase)
