import * as React from 'react'
import {MutableRefObject} from 'react'
import {
  ForceConfig,
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
import {debounce, isEqual, noop, remove} from 'lodash'
import {
  DragEndEventHandler,
  DragStartEventHandler,
  HoverEventHandler,
  NodeDragEventHandler,
} from '@graph-viz/core/lib/MouseInteraction'

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

export interface GraphVizComponentProps {
  nodes: GraphVizNode[]
  links: GraphVizLink[]
  groups: GraphVizGroup[]
  tooltips: Partial<TooltipNode>[]
  onRefresh?: () => any
  onError?: (error: Error) => any
  config?: ConfigurationOptions
  forceConfig?: ForceConfig
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

  // TODO Simplify
  // -------------
  // instead of exposing these via props, we should
  // expose the visualization instance through the ref API
  // and support binding multiple handlers to each event
  /**
   * callback for event onNodeHoverIn
   */
  onNodeHoverIn?: HoverEventHandler

  /**
   * callback for event onNodeHoverOut
   */
  onNodeHoverOut?: HoverEventHandler

  /**
   * callback for event onNodeDrag
   */
  onNodeDrag?: NodeDragEventHandler

  /**
   * callback for event onDragStart
   */
  onDragStart?: DragStartEventHandler

  /**
   * callback for event onDragEnd
   */
  onDragEnd?: DragEndEventHandler

  /**
   * callback dispatched on secondary click
   */
  onSecondaryClick: (event: MouseEvent, clickedNodeIdx: number | null) => any

  /**
   * on mount this ref points to a function to trigger graph viz initialization
   */
  updateLayoutAndStylesRef?: MutableRefObject<() => any>

  /**
   * on mount this ref points to a function to trigger graph viz updateStyles
   */
  updateStylesRef?: MutableRefObject<() => any>

  /**
   * init callback called with the instances of GraphViz and ForceSimulation
   */
  onInit?: (viz: GraphVisualization, simulation: ForceSimulation) => any

  /**
   * flag to prevent re-rendering the viz by default
   * useful in situation when you want to call render functions on the
   * GraphVisualization instance passed to the parent via onInit
   */
  preventAutomaticVizUpdate?: boolean
}

const DRAFT_NODE_ID = 'draft-node'

export class GraphVizComponent extends React.Component<
  GraphVizComponentProps,
  State
> {
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

  static defaultProps: Partial<GraphVizComponentProps> = {
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

    try {
      this.visualization = new GraphVisualization(
        this.vizData,
        canvas,
        width,
        height,
        this.props.config,
      )
    } catch (err) {
      if (this.props.onError) {
        this.props.onError(err)
        return
      } else {
        throw err
      }
    }

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

      if (this.props.onNodeHoverIn) {
        this.props.onNodeHoverIn(hoveredNodeIdx)
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

      if (this.props.onNodeHoverOut) {
        this.props.onNodeHoverOut(hoveredOutNodeIdx)
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
      if (this.props.onNodeDrag) {
        this.props.onNodeDrag(worldPos, draggedNodeIdx)
      }
    })

    this.visualization.onDragStart(
      (mouse, draggedNodeIdx: number | null, ...rest) => {
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
        if (this.props.onDragStart) {
          this.props.onDragStart(mouse, draggedNodeIdx, ...rest)
        }
      },
    )

    this.visualization.onDragEnd(
      (mouse, targetNodeIdx: number | null, ...rest) => {
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
        if (this.props.onDragEnd) {
          this.props.onDragEnd(mouse, targetNodeIdx, ...rest)
        }
      },
    )

    this.visualization.onSecondaryClick((...args) => {
      this.simulation.stop()
      this.props.onSecondaryClick(...args)
    })

    // Initialize data
    if (this.props.nodes.length > 0) {
      this.updateLayoutAndStyles()
    }

    if (this.props.onInit) {
      this.props.onInit(this.visualization, this.simulation)
    }

    if (this.props.updateLayoutAndStylesRef) {
      this.props.updateLayoutAndStylesRef.current = this.updateLayoutAndStyles
    }

    if (this.props.updateStylesRef) {
      this.props.updateStylesRef.current = this.updateStyles
    }
  }

  componentDidUpdate(prevProps: GraphVizComponentProps) {
    if (
      !this.props.preventAutomaticVizUpdate &&
      (prevProps.nodes !== this.props.nodes ||
        prevProps.links !== this.props.links ||
        prevProps.groups !== this.props.groups)
    ) {
      this.tooltipNodes = this.props.tooltips as TooltipNode[]
      this.updateLayoutAndStyles()
    }

    if (prevProps.groups !== this.props.groups) {
      this.vizData.groups = this.props.groups
      this.visualization.updateGroups(this.vizData.groups)
    }

    if (!isEqual(prevProps.config, this.props.config)) {
      this.visualization.updateConfig(this.props.config)
    }

    if (!isEqual(prevProps.forceConfig, this.props.forceConfig)) {
      this.simulation.updateConfig(this.props.forceConfig)
    }
  }

  componentWillUnmount() {
    if (this.simulation) {
      this.simulation.stop()
    }
    if (this.visualization) {
      this.visualization.dispose()
    }
    window.removeEventListener('resize', this.onWindowResize)
  }

  updateLayoutAndStyles = () => {
    try {
      this.simulation.initialize(
        {
          nodes: this.props.nodes,
          links: this.props.links,
          forceGroups: this.props.groups,
        },
        this.props.forceConfig,
      )
    } catch (err) {
      if (this.props.onError) {
        this.props.onError(err)
        return
      } else {
        throw err
      }
    }

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

  updateStyles = () => {
    this.vizData.nodes = this.props.nodes.map((node, i) =>
      // preserve ref
      Object.assign(
        this.vizData.nodes[i], // preserve layout
        node,
      ),
    )
    this.vizData.links = this.props.links
    this.vizData.groups = this.props.groups

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
        <canvas ref={this.canvasRef} />

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
