import {PersistenceServiceClient} from '@core/services/persistence_service_pb_service'
import {Empty} from '@core/wrappers_pb'
import {createStyles, Theme, Typography, withStyles} from '@material-ui/core'
import * as React from 'react'
import {PERSISTENCE_SERVICE_ADDRESS} from '../App'
import {GraphVizLink} from './lib/Links'
import {TooltipNode} from './NodeTooltips'
import {eventsToVizData} from './protoToNodeUtils'
import {GraphVizComponent, PartialGraphVizNode} from './GraphVizComponent'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      width: 300,
      height: 300,
    },
  })

interface State {
  readonly tooltipNode: TooltipNode | null
  readonly currentlyHoveredIdx: number | null
  readonly errorMessage: string | null
  readonly nodes: PartialGraphVizNode[]
  readonly links: GraphVizLink[]
  readonly tooltips: Partial<TooltipNode>[]
}

class DevGraphBase extends React.Component<any, State> {
  client = new PersistenceServiceClient(PERSISTENCE_SERVICE_ADDRESS)

  readonly state: State = {
    tooltipNode: null,
    currentlyHoveredIdx: null,
    errorMessage: null,
    nodes: [],
    links: [],
    tooltips: [],
  }

  componentDidMount() {
    this.readGraph()
  }

  readGraph = () => {
    this.setState({errorMessage: null})

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

      const {nodes, links, tooltips} = eventsToVizData(response.getValuesList())
      this.setState({
        nodes,
        links,
        tooltips,
        errorMessage: null,
      })
    })
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <Typography color={'error'}>{this.state.errorMessage}</Typography>
        <GraphVizComponent
          nodes={this.state.nodes}
          links={this.state.links}
          tooltips={this.state.tooltips}
          onRefresh={this.readGraph}
        />
      </div>
    )
  }
}

export const DevGraph = withStyles(styles)(DevGraphBase)
