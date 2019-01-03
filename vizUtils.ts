import {Event} from '@core/event_pb'
import {EverythingResponse} from '@core/services/event_service_pb'
import {values} from 'lodash'
import {getAttributeNodeLabel} from '../displayTypes'
import {VisualGraphData, VisualGraphNode} from './lib/GraphVisualization'

export const GraphPalette = {
  ArtifactNode: '#00478D',
  AttributeNode: '#FEC400',
  AlertNode: '#EE6352',
  EmailUploadNode: '#0d8721',
}

const toVisualGraphNode = (node: EverythingResponse.Node): VisualGraphNode => {
  switch (node.getValueCase()) {
  case EverythingResponse.Node.ValueCase.ARTIFACT:
    const artifact = node.getArtifact()! // valueCase matched, so this is safe
    return {
      fill: GraphPalette.ArtifactNode,
      id: artifact.getUid()!.getValue(), // FIXME: potentially unsafe - we're not guaranteed getUid() will be defined
    }
  case EverythingResponse.Node.ValueCase.ATTRIBUTE:
    const attribute = node.getAttribute()! // valueCase matched, so this is safe
    return {
      fill: GraphPalette.AttributeNode,
      id: `${getAttributeNodeLabel(attribute.getType())}::${attribute.getValue()}`,
    }
  case EverythingResponse.Node.ValueCase.EVENT:
    const event = node.getEvent()! // valueCase matched, so this is safe
    return {
      fill: event.getEventType() === Event.Type.ALERT ? GraphPalette.AlertNode : GraphPalette.EmailUploadNode,
      id: event.getUid()!.getValue(), // FIXME: potentially unsafe - we're not guaranteed getUid() will be defined
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
