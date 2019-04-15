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
import {debounce, noop} from 'lodash'
import {GraphVizNode} from './lib/Nodes'
import {VizDisplayGroup} from './lib/DisplayGroups'

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
  readonly draftLinkSourceNode?: PartialGraphVizNode
}

// A partial GraphVizNode with a required id parameter
// Better naming suggestions welcome
export interface PartialGraphVizNode
  extends Partial<GraphVizNode & ForceSimulationNode> {
  id: string
}

interface Props extends WithStyles<typeof styles> {
  nodes: PartialGraphVizNode[]
  links: GraphVizLink[]
  displayGroups: VizDisplayGroup[]
  tooltips: Partial<TooltipNode>[]
  onRefresh?: () => any
  config?: ConfigurationOptions
  showControls?: boolean
  /**
   * enables graph editing
   * i.e. for now only the drawing of links
   */
  editMode?: boolean

  /**
   * callback that will be called when a valid link is drawn
   */
  onLinkDrawn: (source: PartialGraphVizNode, target: PartialGraphVizNode) => any
}

class GraphVizComponentBase extends React.Component<Props, State> {
  client = new PersistenceServiceClient(PERSISTENCE_SERVICE_ADDRESS)
  visualization: GraphVisualization

  // There is no need for vizData to be in state as this data is used by the
  // GraphVisualization class' render cycle and not React.
  vizData: GraphVizData = {
    nodes: [],
    links: [],
    displayGroups: [],
  }

  tooltipNodes: TooltipNode[]
  simulation: BasicForceSimulation

  rootRef: React.RefObject<HTMLDivElement> = React.createRef()
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  readonly state: State = {
    currentTooltipNode: null,
    currentlyHoveredIdx: null,
  }

  static defaultProps: Partial<Props> = {
    tooltips: [],
    displayGroups: [],
    onLinkDrawn: noop,
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
      displayGroups: this.props.displayGroups,
    }
    this.tooltipNodes = this.props.tooltips as TooltipNode[]

    const {width, height} = root.getBoundingClientRect()
    this.visualization = new GraphVisualization(
      {
        nodes: this.vizData.nodes,
        links: this.vizData.links,
        displayGroups: this.vizData.displayGroups.filter(
          gp => gp.isHighlighted,
        ),
      },
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

      this.setState({currentlyHoveredIdx: hoveredNodeIdx})

      const tooltipNode = this.tooltipNodes[hoveredNodeIdx]
      if (tooltipNode) {
        this.setState({
          currentTooltipNode: {
            ...tooltipNode,
            screenX: screenCoords.x,
            screenY: screenCoords.y,
          },
        })
      }
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

      this.simulation.update({
        nodes: this.vizData.nodes,
        links: this.vizData.links,
        forceGroups: this.vizData.displayGroups,
      })
      this.visualization.updateNode(
        clickedNodeIdx,
        this.vizData.nodes[clickedNodeIdx],
      )
    })

    this.visualization.onNodeDrag((worldPos, draggedNodeIdx) => {
      let node
      if (this.props.editMode) {
        node = this.vizData.nodes[
          this.vizData.nodes.length - 1
        ] as ForceSimulationNode
      } else {
        node = this.vizData.nodes[draggedNodeIdx] as ForceSimulationNode
      }
      node.x = worldPos.x
      node.y = worldPos.y
      node.fx = worldPos.x
      node.fy = worldPos.y
      this.simulation.update({
        nodes: this.props.nodes,
        links: this.props.links,
        forceGroups: this.props.displayGroups,
      })
      // ^ the simulation tick handler should handle the position updates after this in our viz
    })

    this.visualization.onDragStart((mouse, draggedNodeIdx: number | null) => {
      if (draggedNodeIdx === null) {
        return
      }
      const draggedNode = this.vizData.nodes[draggedNodeIdx]

      if (this.props.editMode) {
        this.setState({draftLinkSourceNode: draggedNode})
        const draftNode = {
          id: 'draft-node',
          x: mouse.x,
          y: mouse.y,
          absoluteSize: 1,
          // setting charge to 0 is required to ensure that the draftNode
          // does not repel the targets
          charge: 0,
          // Important: disableInteractions on the draft node to make sure hover,
          // click, dragEnd and other events ignore this node
          disableInteractions: true,
          fill: 'orange',
        }
        const draftLink = {
          source: draggedNode.id,
          target: draftNode.id,
          color: 'orange',
        }
        this.vizData.nodes.push(draftNode)
        this.vizData.links.push(draftLink)
        this.visualization.update(this.vizData)
      }
      lockNode(this.vizData.nodes[draggedNodeIdx])
      this.visualization.updateNode(
        draggedNodeIdx,
        this.vizData.nodes[draggedNodeIdx],
      )
      this.simulation.reheat()
    })

    this.visualization.onDragEnd((mouse, targetNodeIdx: number | null) => {
      if (this.props.editMode) {
        if (this.state.draftLinkSourceNode) {
          // this means a draft link was being drawn.
          // Remove the placeholder (draftNode, draftLink) pair
          // which is logically guaranteed to be
          // the last element of the array
          // because dragEnd will ALWAYS execute after dragStart
          this.vizData.nodes.pop()
          this.vizData.links.pop()
          this.visualization.update(this.vizData)

          if (targetNodeIdx !== null) {
            const sourceNode = this.state.draftLinkSourceNode!
            const targetNode = this.vizData.nodes[targetNodeIdx]
            if (sourceNode !== targetNode) {
              this.props.onLinkDrawn(sourceNode, targetNode)
            }
            this.setState({draftLinkSourceNode: undefined})
          }
        }
      }
      this.simulation.settle()
    })

    // Initialize data
    if (this.props.nodes.length > 0) {
      this.initData()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.nodes !== this.props.nodes ||
      prevProps.links !== this.props.links
    ) {
      this.tooltipNodes = this.props.tooltips as TooltipNode[]
      this.initData()
    }
    if (prevProps.displayGroups !== this.props.displayGroups) {
      this.vizData.displayGroups = this.props.displayGroups
      this.visualization.updateDisplayGroups(
        this.props.displayGroups.filter(gp => gp.isHighlighted),
      )
    }
  }

  componentWillUnmount() {
    this.simulation.stop()
    this.visualization.dispose()
    window.removeEventListener('resize', this.onWindowResize)
  }

  initData() {
    this.simulation.stop()
    this.simulation.initialize({
      nodes: this.props.nodes,
      links: this.props.links,
      forceGroups: this.props.displayGroups,
    })

    const nodePositions = this.simulation.getNodePositions()

    this.vizData = {
      nodes: this.props.nodes.map((node, i) => {
        node.x = nodePositions[i].x
        node.y = nodePositions[i].y
        return node
      }) as GraphVizNode[],
      links: this.props.links as GraphVizLink[],
      displayGroups: this.props.displayGroups,
    }

    this.visualization.update(this.vizData)
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
          <div className={classes.actionButtons}>
            <Grid container direction={'column'}>
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
          </div>
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
