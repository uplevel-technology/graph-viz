import {Artifact} from '@core/artifact_pb'
import {Attribute} from '@core/attribute_pb'
import {Event} from '@core/event_pb'
import {ObservableNode} from '@core/observable_pb'
import {values} from 'lodash'
import {getArtifactNodeLabel, getAttributeNodeLabel} from '../displayTypes'
import {ForceSimulationLink} from './lib/BasicForceSimulation'
import {GraphVizLink} from './lib/NextLinks'
import {GraphVizNode} from './lib/NextNodes'
import {TooltipNode} from './NodeTooltips'

/*
TODO: maintain a map of color names to their hex codes in addition to the fill and outline palettes below

additional colors from kaori (fill, then outline)
YELLOW
FFD74F
FF8A3A

 */

// NOTE that the keys corresponding to specific attribute types must match the labels in
// neo4j (for the microsoft data, that's snake_case)
export const NodeFillPalette: {[key: string]: string} = {
  artifact: '#00478D',
  attribute: '#FEC400',
  alert: '#F16576', // red
  emailUpload: '#0d8721',
  ip_address: '#86B4EA', // blue
  port: '#CFDEFF', // light blue
  file_name: '#A68ABE', // purple
  file_path: '#EED6F2', // pink
  hash: '#C0F3FA', // cyan
  url: '#7ED3C0', // green
  application: '#CCFF90', // light green
  process: '#FFA76B', // orange
}

export const NodeOutlinePalette: {[key: string]: string} = {
  artifact: '#00478D',
  attribute: '#FEC400',
  alert: '#921928', // red
  emailUpload: '#0d8721',
  ip_address:    '#005DB8', // blue
  port: '#5986EC', // light blue
  file_name: '#5B129B', // purple
  file_path: '#EA80FC', // pink
  hash: '#08A7BB', // cyan
  url: '#278C90', // green
  application: '#9ACA95', // light green
  process: '#FC6600', // orange
}

const artifactToNode = (artifact: Artifact): Partial<GraphVizNode> => ({
  id: artifact.getUid()!.getValue(),
  fill: NodeFillPalette.artifact,
  stroke: NodeOutlinePalette.artifact,
  strokeWidth: 0.03,
  strokeOpacity: 1.0,
})

const artifactToTooltipNode = (artifact: Artifact): Partial<TooltipNode> => ({
  displayName: getArtifactNodeLabel(artifact.getType()),
})

const attributeToNode = (attribute: Attribute): Partial<GraphVizNode> => ({
  id: `${getAttributeNodeLabel(attribute.getType())}::${attribute.getValue()}`,
  fill: NodeFillPalette.attribute,
  stroke: NodeOutlinePalette.attribute,
  size: 20,
  strokeWidth: 0.03,
  strokeOpacity: 1.0,
})

const attributeToTooltipNode = (attribute: Attribute): Partial<TooltipNode> => ({
  displayName: getAttributeNodeLabel(attribute.getType()),
})

const observableToNode = (observable: ObservableNode): Partial<GraphVizNode> => {
  switch (observable.getValueCase()) {
  case ObservableNode.ValueCase.ARTIFACT:
    return artifactToNode(observable.getArtifact()!)
  case ObservableNode.ValueCase.ATTRIBUTE:
    return attributeToNode(observable.getAttribute()!)
  }
  throw new Error('unexpected observable node type: ' + observable.getValueCase())
}

const observableToTooltipNode = (observable: ObservableNode): Partial<TooltipNode> => {
  switch (observable.getValueCase()) {
  case ObservableNode.ValueCase.ARTIFACT:
    return artifactToTooltipNode(observable.getArtifact()!)
  case ObservableNode.ValueCase.ATTRIBUTE:
    return attributeToTooltipNode(observable.getAttribute()!)
  }
  throw new Error('unexpected observable node type: ' + observable.getValueCase())
}

const eventToNode = (event: Event): Partial<GraphVizNode> => ({
  id: event.getUid()!.getValue(),
  fill: event.getEventType() === Event.Type.ALERT
    ? NodeFillPalette.alert
    : NodeFillPalette.emailUpload,
  stroke: event.getEventType() === Event.Type.ALERT
    ? NodeOutlinePalette.alert
    : NodeOutlinePalette.emailUpload,
  strokeWidth: 0.03,
  strokeOpacity: 1.0,
})

const eventToTooltipNode = (event: Event): Partial<TooltipNode> => {
  let displayName = event.getEventType() === Event.Type.ALERT
    ? `Alert (${event.getUid()})`
    : `Email Upload (${event.getUid()})`

  const display = event.getDisplay()
  if (display) {
    displayName = display.getName()
  }

  return {
    displayName,
  }
}

interface PartialGraphVizData {
  nodes: Partial<GraphVizNode>[]
  links: Partial<GraphVizLink>[]
}

export const getAllVizData = (events: Event[]): {
  graphData: PartialGraphVizData,
  tooltipsNodes: Partial<TooltipNode>[],
} => {
  // We want a deduped list of all nodes, because they can be repeated. We'll
  // build that up in this object:
  const seenVizNodesById: {[id: string]: {vizNode: Partial<GraphVizNode>, tooltipNode: Partial<TooltipNode>}} = {}
  const links: ForceSimulationLink[] = []

  events.forEach((event) => {
    const eventNode = eventToNode(event)
    seenVizNodesById[eventNode.id!] = {
      vizNode: eventNode,
      tooltipNode: eventToTooltipNode(event),
    }

    const observed = event.getObserved()
    if (!observed) {
      return
    }

    observed.getAttributesList().forEach((ao) => {
      const attrNode = attributeToNode(ao.getAttribute()!)
      seenVizNodesById[attrNode.id!] = {
        vizNode: attrNode,
        tooltipNode: attributeToTooltipNode(ao.getAttribute()!),
      }

      links.push({
        source: eventNode.id!,
        target: attrNode.id!,
      })
    })

    observed.getRelationshipsList().forEach((rel) => {
      const from = observableToNode(rel.getFrom()!)
      seenVizNodesById[from.id!] = {
        vizNode: from,
        tooltipNode: observableToTooltipNode(rel.getFrom()!),
      }

      const to = observableToNode(rel.getTo()!)
      seenVizNodesById[to.id!] = {
        vizNode: to,
        tooltipNode: observableToTooltipNode(rel.getTo()!),
      }

      links.push({
        source: from.id!,
        target: to.id!,
      })

      // We also add links from the eventNode, to approximate having hyperedges:
      links.push({
        source: eventNode.id!,
        target: from.id!,
      })
      links.push({
        source: eventNode.id!,
        target: to.id!,
      })
    })
  })
  const seenNodes = values(seenVizNodesById)

  return {
    graphData: {
      nodes: seenNodes.map(it => it.vizNode),
      links,
    },
    tooltipsNodes: seenNodes.map(it => it.tooltipNode),
  }
}
