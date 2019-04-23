import {Artifact} from '@core/artifact_pb'
import {Attribute} from '@core/attribute_pb'
import {EventFields, EventType} from '@core/event_pb'
import {ObservableNode} from '@core/observable_pb'
import {camelCase, values} from 'lodash'
import {
  getArtifactDisplayType,
  getAttributeDisplayType,
  getAttributeNodeLabel,
  getEventNodeDisplayType,
} from '../displayTypes'
import {TooltipNode} from './NodeTooltips'
import {NodeFillPalette, NodeOutlinePalette} from './vizUtils'
import {GraphVizLink, GraphVizNode} from './GraphVizComponent'
import * as moment from 'moment'

export const artifactToNode = (artifact: Artifact): GraphVizNode => ({
  id: artifact.getUid()!.getValue(),
  fill: NodeFillPalette.artifact,
  stroke: NodeOutlinePalette.artifact,
  strokeWidth: 0.03,
  strokeOpacity: 1.0,
})

export const artifactToTooltipNode = (
  artifact: Artifact,
): Partial<TooltipNode> => ({
  displayName: getArtifactDisplayType(artifact.getType()),
})

export const attributeToNode = (
  attribute: Attribute,
  clusterId?: number,
): GraphVizNode => {
  const attributeType = getAttributeNodeLabel(attribute.getType())

  const out: GraphVizNode = {
    id: getAttributeLexeme(attribute),
    fill:
      NodeFillPalette[camelCase(attributeType)] || NodeFillPalette.attribute,
    stroke:
      NodeOutlinePalette[camelCase(attributeType)] ||
      NodeOutlinePalette.attribute,
    strokeWidth: 0.03,
    strokeOpacity: 1.0,
  }

  const groupIds: string[] = []

  if (clusterId !== undefined) {
    groupIds.push(clusterId.toString())
  }

  if (attribute.getMatchingPattern() !== '') {
    groupIds.push(attribute.getMatchingPattern())
    out.charge = 0 // remove the repulsive charge on pattern nodes to prevent conflicting forces
    out.absoluteSize = 12
  }

  if (groupIds.length > 0) {
    out.displayGroupIds = groupIds
  }

  return out
}

export const getAttributeLexeme = (attribute: Attribute): string => {
  return `${getAttributeNodeLabel(
    attribute.getType(),
  )}::${attribute.getValue()}`
}

export const attributeToTooltipNode = (
  attribute: Attribute,
  clusterId?: number,
): Partial<TooltipNode> => {
  let displayType = getAttributeDisplayType(attribute.getType())
  if (attribute.getIsPattern()) {
    displayType += ' Pattern'
  }

  const out: Partial<TooltipNode> = {
    id: getAttributeLexeme(attribute),
    displayType,
    displayName: attribute.getValue(),
  }

  if (clusterId !== undefined) {
    out.clusterId = clusterId
  }

  if (attribute.getMatchingPattern() !== '') {
    out.pattern = attribute.getMatchingPattern()
  }

  return out
}

export const observableToNode = (observable: ObservableNode): GraphVizNode => {
  switch (observable.getValueCase()) {
    case ObservableNode.ValueCase.ARTIFACT:
      return artifactToNode(observable.getArtifact()!)
    case ObservableNode.ValueCase.ATTRIBUTE:
      return attributeToNode(observable.getAttribute()!)
  }
  throw new Error(
    'unexpected observable node type: ' + observable.getValueCase(),
  )
}

export const observableToTooltipNode = (
  observable: ObservableNode,
): Partial<TooltipNode> => {
  switch (observable.getValueCase()) {
    case ObservableNode.ValueCase.ARTIFACT:
      return artifactToTooltipNode(observable.getArtifact()!)
    case ObservableNode.ValueCase.ATTRIBUTE:
      return attributeToTooltipNode(observable.getAttribute()!)
  }
  throw new Error(
    'unexpected observable node type: ' + observable.getValueCase(),
  )
}

export const eventToNode = (event: EventFields): GraphVizNode => ({
  id: event.getUid()!.getValue(),
  displayGroupIds: [event.getClusterId().toString()],
  fill:
    event.getEventType() === EventType.ALERT
      ? NodeFillPalette.alert
      : NodeFillPalette.emailUpload,
  stroke:
    event.getEventType() === EventType.ALERT
      ? NodeOutlinePalette.alert
      : NodeOutlinePalette.emailUpload,
  strokeWidth: 0.03,
  strokeOpacity: 1.0,
  absoluteSize: 30,
})

export const eventToTooltipNode = (
  event: EventFields,
): Partial<TooltipNode> => {
  let displayName =
    event.getEventType() === EventType.ALERT
      ? `Alert (${event.getUid()})`
      : `Email Upload (${event.getUid()})`

  const display = event.getDisplay()
  if (display) {
    displayName = display.getName()
  }

  // all events should have occurred timestamps, but in case one doesn't
  // this check avoids breaking the viz
  const occurred =
    (event.getOccurredAt() && event.getOccurredAt()!.toDate()) || Date.now()

  const out: Partial<TooltipNode> = {
    id: event.getUid()!.getValue(),
    displayName,
    displayType: 'Event',
    formattedTime: moment(occurred).format('MMM DD YYYY'),
  }

  if (event.getClusterId() > 0) {
    out.clusterId = event.getClusterId()
  }

  return out
}

interface AttributeWithClusterId extends Attribute {
  clusterId: number
}

type someNode = EventFields | AttributeWithClusterId
interface SomeLink {
  source: someNode
  target: someNode
}
interface NodesAndLinks {
  nodes: someNode[]
  links: SomeLink[]
}

export interface VizData {
  nodes: GraphVizNode[]
  links: GraphVizLink[]
  tooltips: Partial<TooltipNode>[]
  legendLabels: string[]
}

// TODO figure out where supernode check should be
// TODO inspect and extract data from observable relationships
const eventsToNodesAndLinks = (events: EventFields[]): NodesAndLinks => {
  // use maps for deduping
  const nodes: {[id: string]: someNode} = {}
  const links: {[id: string]: SomeLink} = {} // only allow one link between node pair [in each direction]

  events.forEach(event => {
    const eventId = event.getUid()!.getValue()
    nodes[eventId] = event

    const observed = event.getObserved()
    if (observed) {
      observed.getAttributesList().forEach(ao => {
        if (ao.getAttribute() !== undefined) {
          if (!ao.getAttribute()!.getIsSupernode()) {
            const attrPlus: AttributeWithClusterId = Object.assign(
              ao.getAttribute(),
              {
                clusterId: event.getClusterId(),
              },
            )
            const attributeId = getAttributeLexeme(attrPlus)
            nodes[attributeId] = attrPlus
            links[eventId + attributeId] = {source: event, target: attrPlus}
          }
        }
      })
    }
  })

  return {
    nodes: values(nodes),
    links: values(links),
  }
}

const toVizNodes = (nodes: someNode[]): GraphVizNode[] => {
  const vizNodes: GraphVizNode[] = []

  nodes.forEach((n: someNode) => {
    if (n instanceof EventFields) {
      vizNodes.push(eventToNode(n))
    }
    if (n instanceof Attribute) {
      vizNodes.push(attributeToNode(n, n.clusterId))
    }
  })

  return vizNodes
}

const getIdForSomeNode = (n: someNode): string => {
  if (n instanceof EventFields) {
    return n.getUid()!.getValue()
  }
  return getAttributeLexeme(n)
}

const toVizLinks = (links: SomeLink[]): GraphVizLink[] => {
  return links.map(link => {
    const newLink: GraphVizLink = {
      source: getIdForSomeNode(link.source),
      target: getIdForSomeNode(link.target),
    }

    if (
      link.source instanceof Attribute &&
      link.source.getMatchingPattern() !== ''
    ) {
      // reduce the attractive force between an event and an attribute node that belongs to a pattern group
      newLink.strengthMultiplier = 0.5
    }

    if (
      link.target instanceof Attribute &&
      link.target.getMatchingPattern() !== ''
    ) {
      // reduce the attractive force between an event and an attribute node that belongs to a pattern group
      newLink.strengthMultiplier = 0.5
    }

    return newLink
  })
}

const toTooltips = (nodes: someNode[]): Partial<TooltipNode>[] => {
  const tooltips: Partial<TooltipNode>[] = []

  nodes.forEach((n: someNode) => {
    if (n instanceof EventFields) {
      tooltips.push(eventToTooltipNode(n))
    }
    if (n instanceof Attribute) {
      tooltips.push(attributeToTooltipNode(n, n.clusterId))
    }
  })

  return tooltips
}

const toLegendData = (nodes: someNode[]): string[] => {
  // keep track of event and attribute types separately so that
  // we can make the event types appear first in the legend

  const eventTypes: Set<string> = new Set()
  const attrTypes: Set<string> = new Set([])

  nodes.forEach((n: someNode) => {
    if (n instanceof EventFields) {
      eventTypes.add(getEventNodeDisplayType(n.getEventType()))
    }
    if (n instanceof Attribute) {
      attrTypes.add(getAttributeDisplayType(n.getType()))
    }
  })

  return Array.from(eventTypes).concat(Array.from(attrTypes))
}

export const eventsToVizData = (events: EventFields[]): VizData => {
  const data = eventsToNodesAndLinks(events)

  return {
    nodes: toVizNodes(data.nodes),
    links: toVizLinks(data.links),
    tooltips: toTooltips(data.nodes),
    legendLabels: toLegendData(data.nodes),
  }
}

export const getLegendData = (events: EventFields[]): string[] => {
  // keep track of event and attribute types separately so that
  // we can make the event types appear first in the legend

  const eventTypes: Set<string> = new Set()
  const attrTypes: Set<string> = new Set([])

  const getObsLabel = (t: ObservableNode) => {
    if (t.getValueCase() === ObservableNode.ValueCase.ARTIFACT) {
      return 'Artifact'
    } else {
      return getAttributeDisplayType(t.getAttribute()!.getType())
    }
  }

  events.forEach(event => {
    const observed = event.getObserved()
    if (!observed) {
      return
    }

    eventTypes.add(getEventNodeDisplayType(event.getEventType()))

    observed.getAttributesList().forEach(ao => {
      attrTypes.add(getAttributeDisplayType(ao.getAttribute()!.getType()))
    })

    observed.getRelationshipsList().forEach(rel => {
      attrTypes.add(getObsLabel(rel.getFrom()!))
      attrTypes.add(getObsLabel(rel.getTo()!))
    })
  })

  return Array.from(eventTypes).concat(Array.from(attrTypes))
}
