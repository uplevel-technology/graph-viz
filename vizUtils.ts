import {Event} from '@core/event_pb'
import {EverythingResponse} from '@core/services/event_service_pb'
import {values} from 'lodash'
import {getArtifactNodeLabel, getAttributeNodeLabel} from '../displayTypes'
import {VisualGraphData, VisualGraphNode} from './lib/GraphVisualization'

export const GraphPalette = {
  ArtifactNode: '#00478D',
  AttributeNode: '#FEC400',
  AlertNode: '#EE6352',
  EmailUploadNode: '#0d8721',
}

export const getNodeVizId = (node: EverythingResponse.Node): string => {
  switch (node.getValueCase()) {
  case EverythingResponse.Node.ValueCase.ARTIFACT:
    return node.getArtifact()!.getUid()!.getValue()
  case EverythingResponse.Node.ValueCase.ATTRIBUTE:
    return `${getAttributeNodeLabel(node.getAttribute()!.getType())}::${node.getAttribute()!.getValue()}`
  case EverythingResponse.Node.ValueCase.EVENT:
    return node.getEvent()!.getUid()!.getValue()
  case EverythingResponse.Node.ValueCase.VALUE_NOT_SET:
    throw new Error('EverythingResponse.Node value not set')
  default:
    // This should happen when a new ObservableNode type was added to the proto
    // but not updated here.
    throw new Error('Unknown EverythingResponse.Node value:' + node.getValueCase())
  }
}

export const getNodeDisplayName = (node: EverythingResponse.Node): string => {
  switch (node.getValueCase()) {
  case EverythingResponse.Node.ValueCase.ARTIFACT:
    return getArtifactNodeLabel(node.getArtifact()!.getType())
  case EverythingResponse.Node.ValueCase.ATTRIBUTE:
    return getAttributeNodeLabel(node.getAttribute()!.getType())
  case EverythingResponse.Node.ValueCase.EVENT:
    const event = node.getEvent()! // valueCase matched, so this is safe
    const display = event.getDisplay()
    if (display) {
      return display.getName()
    }
    return event.getEventType() === Event.Type.ALERT
      ? `Alert (${event.getUid()})`
      : `Email Upload (${event.getUid()})`
  case EverythingResponse.Node.ValueCase.VALUE_NOT_SET:
    throw new Error('EverythingResponse.Node value not set')
  default:
    // This should happen when a new ObservableNode type was added to the proto
    // but not updated here.
    throw new Error('Unknown EverythingResponse.Node value:' + node.getValueCase())
  }
}

const toVisualGraphNode = (node: EverythingResponse.Node): VisualGraphNode => {
  switch (node.getValueCase()) {
  case EverythingResponse.Node.ValueCase.ARTIFACT:
    return {
      id: getNodeVizId(node),
      displayName: getArtifactNodeLabel(node.getArtifact()!.getType()),
      fill: GraphPalette.ArtifactNode,
    }
  case EverythingResponse.Node.ValueCase.ATTRIBUTE:
    return {
      id: getNodeVizId(node),
      displayName: getAttributeNodeLabel(node.getAttribute()!.getType()),
      fill: GraphPalette.AttributeNode,
    }
  case EverythingResponse.Node.ValueCase.EVENT:
    const event = node.getEvent()!
    let displayName = event.getEventType() === Event.Type.ALERT
      ? `Alert (${event.getUid()})`
      : `Email Upload (${event.getUid()})`

    const display = event.getDisplay()
    if (display) {
      displayName = display.getName()
    }

    return {
      id: getNodeVizId(node),
      displayName,
      fill: node.getEvent()!.getEventType() === Event.Type.ALERT
        ? GraphPalette.AlertNode
        : GraphPalette.EmailUploadNode,
    }
  case EverythingResponse.Node.ValueCase.VALUE_NOT_SET:
    throw new Error('EverythingResponse.Node value not set')
  default:
    // This should happen when a new ObservableNode type was added to the proto
    // but not updated here.
    throw new Error('Unknown EverythingResponse.Node value:' + node.getValueCase())
  }
}

export const toVisualGraphData = (data: EverythingResponse): VisualGraphData => {
  // We want a deduped list of all nodes, whether they were seen in the "nodes"
  // or "links" part of the message. We'll build that up in this object:
  const seenVizNodesById: {[id: string]: VisualGraphNode} = {}

  data.getNodesList().map(toVisualGraphNode).forEach((node) => {
    seenVizNodesById[node.id] = node
  })

  const links = data.getLinksList().map((link) => ({
    source: toVisualGraphNode(link.getFrom()!), // TODO: handle null?
    target: toVisualGraphNode(link.getTo()!), // TODO: handle null?
  }))

  links.forEach((link) => {
    seenVizNodesById[link.source.id] = link.source
    seenVizNodesById[link.target.id] = link.target
  })

  return {
    nodes: values(seenVizNodesById),
    links,
  }
}
