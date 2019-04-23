import {Attribute} from '@core/attribute_pb'
import {EventFields, EventType} from '@core/event_pb'
import {camelCase, values} from 'lodash'
import {
  getAttributeDisplayType,
  getAttributeNodeLabel,
  getEventNodeDisplayType,
} from '../displayTypes'
import {TooltipNode, TooltipFields} from './NodeTooltips'
import {NodeFillPalette, NodeOutlinePalette} from './vizUtils'
import {GraphVizLink, GraphVizNode} from './GraphVizComponent'
import * as moment from 'moment'

export const getAttributeLexeme = (attribute: Attribute): string => {
  return `${getAttributeNodeLabel(
    attribute.getType(),
  )}::${attribute.getValue()}`
}

const toGraphVizNodes = (nodes: someNode[]): GraphVizNode[] => {
  const vizNodes: GraphVizNode[] = []

  nodes.forEach((n: someNode) => {
    if (n instanceof EventFields) {
      vizNodes.push(eventToGraphVizNode(n))
    }
    if (n instanceof Attribute) {
      vizNodes.push(attributeToGraphVizNode(n, n.clusterId))
    }
  })

  return vizNodes
}

export const attributeToGraphVizNode = (
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

export const eventToGraphVizNode = (event: EventFields): GraphVizNode => ({
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

const toTooltipNodes = (nodes: someNode[]): TooltipFields[] => {
  const tooltips: TooltipFields[] = []

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

export const attributeToTooltipNode = (
  attribute: Attribute,
  clusterId?: number,
): TooltipFields => {
  let displayType = getAttributeDisplayType(attribute.getType())
  if (attribute.getIsPattern()) {
    displayType += ' Pattern'
  }

  const out: TooltipFields = {
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

export const eventToTooltipNode = (event: EventFields): TooltipFields => {
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

  const out: TooltipFields = {
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
  tooltips: TooltipFields[]
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
    nodes: toGraphVizNodes(data.nodes),
    links: toVizLinks(data.links),
    tooltips: toTooltipNodes(data.nodes),
    legendLabels: toLegendData(data.nodes),
  }
}
