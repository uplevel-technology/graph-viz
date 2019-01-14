import {Artifact} from '@core/artifact_pb'
import {Attribute} from '@core/attribute_pb'
import {Event} from '@core/event_pb'
import {ObservableNode} from '@core/observable_pb'
import {values} from 'lodash'
import {getArtifactNodeLabel, getAttributeNodeLabel} from '../displayTypes'
import {VisualGraphData, VisualGraphNode, VisualGraphLink} from './lib/GraphVisualization'

/*
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

export const OutlineAndLinkPalette: {[key: string]: string} = {
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

const artifactToNode = (artifact: Artifact): VisualGraphNode => {
  return {
    id: artifact.getUid()!.getValue(),
    displayName: getArtifactNodeLabel(artifact.getType()),
    fill: NodeFillPalette.artifact,
  }
}

const attributeToNode = (attribute: Attribute): VisualGraphNode => {
  return {
    id: `${getAttributeNodeLabel(attribute.getType())}::${attribute.getValue()}`,
    displayName: getAttributeNodeLabel(attribute.getType()),
    fill: NodeFillPalette.attribute,
  }
}

const observableToNode = (observable: ObservableNode): VisualGraphNode => {
  switch (observable.getValueCase()) {
  case ObservableNode.ValueCase.ARTIFACT:
    return artifactToNode(observable.getArtifact()!)
  case ObservableNode.ValueCase.ATTRIBUTE:
    return attributeToNode(observable.getAttribute()!)
  }
  throw new Error('unexpected observable node type: ' + observable.getValueCase())
}

const eventToNode = (event: Event): VisualGraphNode => {
  let displayName = event.getEventType() === Event.Type.ALERT
    ? `Alert (${event.getUid()})`
    : `Email Upload (${event.getUid()})`

  const display = event.getDisplay()
  if (display) {
    displayName = display.getName()
  }

  return {
    id: event.getUid()!.getValue(),
    displayName,
    fill: event.getEventType() === Event.Type.ALERT
      ? NodeFillPalette.alert
      : NodeFillPalette.emailUpload,
  }
}

export const toVisualGraphData = (events: Event[]): VisualGraphData => {
  // We want a deduped list of all nodes, because they can be repeated. We'll
  // build that up in this object:
  const seenVizNodesById: {[id: string]: VisualGraphNode} = {}
  // Links shouldn't be deduped, though:
  const links: VisualGraphLink[] = []

  events.forEach((event) => {
    const eventNode = eventToNode(event)
    seenVizNodesById[eventNode.id] = eventNode

    const observed = event.getObserved()
    if (!observed) {
      return
    }

    observed.getAttributesList().forEach((ao) => {
      const attrNode = attributeToNode(ao.getAttribute()!)
      seenVizNodesById[attrNode.id] = attrNode

      links.push({
        source: eventNode,
        target: attrNode,
      })
    })

    observed.getRelationshipsList().forEach((rel) => {
      const from = observableToNode(rel.getFrom()!)
      seenVizNodesById[from.id] = from

      const to = observableToNode(rel.getTo()!)
      seenVizNodesById[to.id] = to

      links.push({
        source: from,
        target: to,
      })

      // We also add links from the eventNode, to approximate having hyperedges:
      links.push({
        source: eventNode,
        target: from,
      })
      links.push({
        source: eventNode,
        target: to,
      })
    })
  })

  return {
    nodes: values(seenVizNodesById),
    links,
  }
}
