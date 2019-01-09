import {Artifact} from '@core/artifact_pb'
import {Attribute} from '@core/attribute_pb'
import {Event} from '@core/event_pb'
import {ObservableNode} from '@core/observable_pb'
import {values} from 'lodash'
import {getArtifactNodeLabel, getAttributeNodeLabel} from '../displayTypes'
import {VisualGraphData, VisualGraphNode, VisualGraphLink} from './lib/GraphVisualization'

export const GraphPalette = {
  ArtifactNode: '#00478D',
  AttributeNode: '#FEC400',
  AlertNode: '#EE6352',
  EmailUploadNode: '#0d8721',
}

const artifactToNode = (artifact: Artifact): VisualGraphNode => {
  return {
    id: artifact.getUid()!.getValue(),
    displayName: getArtifactNodeLabel(artifact.getType()),
    fill: GraphPalette.ArtifactNode,
  }
}

const attributeToNode = (attribute: Attribute): VisualGraphNode => {
  return {
    id: `${getAttributeNodeLabel(attribute.getType())}::${attribute.getValue()}`,
    displayName: getAttributeNodeLabel(attribute.getType()),
    fill: GraphPalette.AttributeNode,
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
      ? GraphPalette.AlertNode
      : GraphPalette.EmailUploadNode,
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
