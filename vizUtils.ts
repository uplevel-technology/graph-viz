import {EverythingResponse} from '@core/services/event_service_pb'
import {VisualGraphLink, VisualGraphNode} from './lib/GraphVisualization'
import {getArtifactNodeLabel, getAttributeNodeLabel, getEventNodeLabel} from '../displayTypes'
import {values} from 'lodash'

export const graphNodePalette = {
  artifact: '#00478D',
  attribute: '#FEC400',
  alert: '#EE6352',
  email_upload: '#0d8721',
}

// Temp hacky types introduced here until we decide on the right format from the backend
interface TmpVizNode {
  type: 'artifact' | 'attribute' | 'alert' | 'email_upload'
  subType: string // technically, could reduce this down to the set of Artifact.Type | Attribute.Type ... and alert?
  vizId: string
}

interface TmpVizLink {
  from: TmpVizNode
  to: TmpVizNode
  // TODO: relationship type
}

interface TmpVizGraph {
  nodes: TmpVizNode[]
  links: TmpVizLink[]
}

const formatVizNode = (node: EverythingResponse.Node): TmpVizNode => {
  switch (node.getValueCase()) {
  case EverythingResponse.Node.ValueCase.ARTIFACT:
    const artifact = node.getArtifact()! // valueCase matched, so this is safe
    return {
      type: 'artifact',
      subType: getArtifactNodeLabel(artifact.getType()),
      vizId: artifact.getUid()!.getValue(), // FIXME: potentially unsafe - we're not guaranteed getUid() will be defined
    }
  case EverythingResponse.Node.ValueCase.ATTRIBUTE:
    const attribute = node.getAttribute()! // valueCase matched, so this is safe
    return {
      type: 'attribute',
      subType: getAttributeNodeLabel(attribute.getType()),
      vizId: attribute.getValue(),
    }
  case EverythingResponse.Node.ValueCase.EVENT:
    const event = node.getEvent()! // valueCase matched, so this is safe
    return {
      type: getEventNodeLabel(event.getEventType()),
      subType: event.getDisplay()!.getName(),
      vizId: event.getUid()!.getValue(), // FIXME: potentially unsafe - we're not guaranteed getUid() will be defined
    }
  case EverythingResponse.Node.ValueCase.VALUE_NOT_SET:
    throw new Error('EverythingResponse.Node value not set')
  default:
    // This should happen when a new ObservableNode type was added to the proto
    // but not updated here.
    throw new Error('Unknown EverythingResponse.Node value:' + node.getValueCase())
  }
}

export const formatVizData = (data: EverythingResponse): TmpVizGraph => {
  // We want a deduped list of all nodes, whether they were seen in the "nodes"
  // or "links" part of the message. We'll build that up in this object:
  const seenVizNodesById: {[vizId: string]: TmpVizNode} = {}

  data.getNodesList().map(formatVizNode).forEach((node) => {
    seenVizNodesById[node.vizId] = node
  })

  const links = data.getLinksList().map((link) => ({
    from: formatVizNode(link.getFrom()!), // TODO: handle null?
    to: formatVizNode(link.getTo()!), // TODO: handle null?
  }))

  links.forEach((link) => {
    seenVizNodesById[link.from.vizId] = link.from
    seenVizNodesById[link.to.vizId] = link.to
  })

  return {nodes: values(seenVizNodesById), links}
}

export const transformNode = (node: TmpVizNode): VisualGraphNode => ({
  displayName: `${node.subType} (${node.vizId})`,
  fill: graphNodePalette[node.type],
  id: node.vizId,
  ...node,
})

export const transformLink = (link: TmpVizLink): VisualGraphLink => {
  const source = link.from.vizId
  const target = link.to.vizId
  return {
    id: `${source}-${target}`,
    source,
    target,
  }
}
