import * as React from 'react'
import {
  ForceSimulation,
  NodePosition,
  SimulationGroup,
  SimulationLink,
  SimulationNode,
} from '@graph-viz/layouts'
import {
  ConfigurationOptions,
  DisplayGroup,
  DisplayLink,
  DisplayNode,
  GraphVisualization,
  VisualizationInputData,
} from '@graph-viz/core'
import {NodeTooltips, TooltipNode} from './NodeTooltips'
import {lockNode, magnifyNode, resetNodeScale, toggleNodeLock} from './vizUtils'
import {debounce, noop, remove} from 'lodash'

/**
 * Primary GraphVizData type definitions
 */
export type GraphVizNode = Partial<DisplayNode & SimulationNode> &
  Pick<DisplayNode, 'id'> // id is a required field

export type GraphVizLink = DisplayLink & SimulationLink

export type GraphVizGroup = DisplayGroup & SimulationGroup

const styles = {
  root: {
    display: 'flex',
    position: 'relative' as const,
    width: '100%',
    height: '100%',
  },
  canvas: {
    backgroundColor: 'white',
  },
  actionButtons: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
  },
}

interface State {
  readonly currentTooltipNode: TooltipNode | null
  readonly currentlyHoveredIdx: number | null
  readonly draftLinkSourceNode?: GraphVizNode
}

interface Props {
  nodes: GraphVizNode[]
  links: GraphVizLink[]
  groups: GraphVizGroup[]
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
   * callback dispatched when a valid link is drawn.
   * requires editMode to be true
   */
  onLinkDrawn: (source: GraphVizNode, target: GraphVizNode) => any

  /**
   * callback dispatched on primary click
   */
  onClick: (event: MouseEvent, clickedNodeIdx: number | null) => any

  /**
   * callback dispatched on secondary click
   */
  onSecondaryClick: (event: MouseEvent, clickedNodeIdx: number | null) => any
}

const DRAFT_NODE_ID = 'draft-node'

export class GraphVizComponent extends React.Component<Props, State> {
  visualization: GraphVisualization

  // There is no need for vizData to be in state as this data is used by the
  // GraphVisualization class' render cycle and not React.
  vizData: VisualizationInputData = {
    nodes: [],
    links: [],
    groups: [],
  }

  tooltipNodes: TooltipNode[]
  simulation: ForceSimulation

  rootRef: React.RefObject<HTMLDivElement> = React.createRef()
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()

  readonly state: State = {
    currentTooltipNode: null,
    currentlyHoveredIdx: null,
  }

  static defaultProps: Partial<Props> = {
    tooltips: [],
    groups: [],
    onLinkDrawn: noop,
    onClick: noop,
    onSecondaryClick: noop,
  }

  onWindowResize: () => void = debounce(() => {
    const root = this.rootRef.current!
    const {width, height} = root.getBoundingClientRect()

    this.visualization.resize(width, height)
  }, 500)

  componentDidMount() {
    const canvas = this.canvasRef.current! // this is safe when mounted
    const root = this.rootRef.current!

    this.vizData = {
      nodes: this.props.nodes as DisplayNode[],
      links: this.props.links,
      groups: this.props.groups,
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

    this.simulation = new ForceSimulation()
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

    this.visualization.onClick(
      (worldPos, clickedNodeIdx, event: MouseEvent) => {
        this.props.onClick(event, clickedNodeIdx)

        if (clickedNodeIdx === null) {
          return
        }

        toggleNodeLock(this.vizData.nodes[clickedNodeIdx])

        this.simulation.update({
          nodes: this.vizData.nodes,
          links: this.vizData.links,
          forceGroups: this.vizData.groups,
        })
        this.visualization.updateNode(
          clickedNodeIdx,
          this.vizData.nodes[clickedNodeIdx],
        )
      },
    )

    this.visualization.onNodeDrag((worldPos, draggedNodeIdx) => {
      let node
      if (this.props.editMode) {
        node = this.vizData.nodes[
          this.vizData.nodes.length - 1
        ] as SimulationNode
      } else {
        node = this.vizData.nodes[draggedNodeIdx] as SimulationNode
      }
      node.x = worldPos.x
      node.y = worldPos.y
      node.fx = worldPos.x
      node.fy = worldPos.y
      this.simulation.update({
        nodes: this.vizData.nodes,
        links: this.vizData.links,
        forceGroups: this.props.groups,
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
          id: DRAFT_NODE_ID,
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
          // This means a draft link was being drawn.
          // Remove the placeholder (draftNode, draftLink) pair
          remove(this.vizData.links, n => n.target === DRAFT_NODE_ID)
          remove(this.vizData.nodes, n => n.id === DRAFT_NODE_ID)
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

    this.visualization.onSecondaryClick((...args) => {
      this.simulation.stop()
      this.props.onSecondaryClick(...args)
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
    if (prevProps.groups !== this.props.groups) {
      this.vizData.groups = this.props.groups
      this.visualization.updateGroups(this.vizData.groups)
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
      forceGroups: this.props.groups,
    })

    const nodePositions = this.simulation.getNodePositions()

    this.vizData = {
      nodes: this.props.nodes.map((node, i) => {
        node.x = nodePositions[i].x
        node.y = nodePositions[i].y
        return node
      }) as DisplayNode[],
      links: this.props.links as DisplayLink[],
      groups: this.props.groups,
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
    const {onRefresh, showControls} = this.props

    return (
      <div ref={this.rootRef} style={styles.root}>
        <canvas ref={this.canvasRef} style={styles.canvas} />

        <NodeTooltips node={this.state.currentTooltipNode} />

        {showControls && (
          <div style={styles.actionButtons}>
            <button onClick={onRefresh}>Refresh</button>
            <button onClick={this.zoomIn}>Zoom in</button>
            <button onClick={this.zoomOut}>Zoom out</button>
          </div>
        )}
      </div>
    )
  }
}
