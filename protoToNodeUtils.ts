import {Artifact} from '@core/artifact_pb'
import {Attribute} from '@core/attribute_pb'
import {Event} from '@core/event_pb'
import {ObservableNode} from '@core/observable_pb'
import {camelCase, values} from 'lodash'
import {
  getArtifactDisplayType,
  getAttributeDisplayType,
  getAttributeNodeLabel,
  getEventNodeLabel,
  ObservableRelationshipDisplayTypes,
  getEventNodeDisplayType,
} from '../displayTypes'
import {GraphVizLink} from './lib/Links'
import {TooltipNode} from './NodeTooltips'
import {NodeFillPalette, NodeOutlinePalette} from './vizUtils'
import {PartialGraphVizNode} from './GraphVizComponent'
import * as moment from 'moment'

export const artifactToNode = (artifact: Artifact): PartialGraphVizNode => ({
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

export const attributeToNode = (attribute: Attribute): PartialGraphVizNode => {
  const attributeType = getAttributeNodeLabel(attribute.getType())
  return {
    id: `${getAttributeNodeLabel(
      attribute.getType(),
    )}::${attribute.getValue()}`,
    fill:
      NodeFillPalette[camelCase(attributeType)] || NodeFillPalette.attribute,
    stroke:
      NodeOutlinePalette[camelCase(attributeType)] ||
      NodeOutlinePalette.attribute,
    strokeWidth: 0.03,
    strokeOpacity: 1.0,
  }
}

export const getAttributeLexeme = (attribute: Attribute): string => {
  return `${getAttributeNodeLabel(
    attribute.getType(),
  )}::${attribute.getValue()}`
}

export const attributeToTooltipNode = (
  attribute: Attribute,
): Partial<TooltipNode> => ({
  id: getAttributeLexeme(attribute),
  displayType: getAttributeDisplayType(attribute.getType()),
  displayName: attribute.getValue(),
})

export const observableToNode = (
  observable: ObservableNode,
): PartialGraphVizNode => {
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

export const eventToNode = (event: Event): PartialGraphVizNode => ({
  id: event.getUid()!.getValue(),
  fill:
    event.getEventType() === Event.Type.ALERT
      ? NodeFillPalette.alert
      : NodeFillPalette.emailUpload,
  stroke:
    event.getEventType() === Event.Type.ALERT
      ? NodeOutlinePalette.alert
      : NodeOutlinePalette.emailUpload,
  strokeWidth: 0.03,
  strokeOpacity: 1.0,
  absoluteSize: 30,
})

export const eventToTooltipNode = (event: Event): Partial<TooltipNode> => {
  let displayName =
    event.getEventType() === Event.Type.ALERT
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

  return {
    id: event.getUid()!.getValue(),
    displayName,
    displayType: 'Event',
    formattedTime: moment(occurred).format('MMM DD YYYY'),
    clusterId: event.getClusterId()!,
  }
}

interface VizData {
  nodes: PartialGraphVizNode[]
  links: GraphVizLink[]
  tooltips: Partial<TooltipNode>[]
}

export const eventsToVizData = (events: Event[]): VizData => {
  // We want a deduped list of all nodes, because they can be repeated. We'll
  // build that up in this object:
  const seenVizNodesById: {
    [id: string]: {
      vizNode: PartialGraphVizNode
      tooltipNode: Partial<TooltipNode>
    }
  } = {}
  const links: GraphVizLink[] = []

  events.forEach(event => {
    const eventNode = eventToNode(event)
    seenVizNodesById[eventNode.id!] = {
      vizNode: eventNode,
      tooltipNode: eventToTooltipNode(event),
    }

    const observed = event.getObserved()
    if (!observed) {
      return
    }

    observed.getAttributesList().forEach(ao => {
      const attrNode = attributeToNode(ao.getAttribute()!)
      seenVizNodesById[attrNode.id!] = {
        vizNode: attrNode,
        tooltipNode: {
          ...attributeToTooltipNode(ao.getAttribute()!),
          clusterId: event.getClusterId(),
        },
      }

      links.push({
        source: eventNode.id!,
        target: attrNode.id!,
      })
    })

    observed.getRelationshipsList().forEach(rel => {
      const from = observableToNode(rel.getFrom()!)
      seenVizNodesById[from.id!] = {
        vizNode: from,
        tooltipNode: {
          ...observableToTooltipNode(rel.getFrom()!),
          clusterId: event.getClusterId(),
        },
      }

      const to = observableToNode(rel.getTo()!)
      seenVizNodesById[to.id!] = {
        vizNode: to,
        tooltipNode: {
          ...observableToTooltipNode(rel.getTo()!),
          clusterId: event.getClusterId(),
        },
      }

      links.push({
        label: ObservableRelationshipDisplayTypes[rel.getType()],
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
    nodes: seenNodes.map(it => it.vizNode),
    links,
    tooltips: seenNodes.map(it => it.tooltipNode),
  }
}

export const getLegendData = (events: Event[]): string[] => {
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
