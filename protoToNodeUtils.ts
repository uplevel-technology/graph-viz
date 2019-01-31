import {Artifact} from '@core/artifact_pb'
import {Attribute} from '@core/attribute_pb'
import {Event} from '@core/event_pb'
import {ObservableNode} from '@core/observable_pb'
import {values} from 'lodash'
import {
  getArtifactNodeLabel,
  getAttributeNodeLabel,
  ObservableRelationshipDisplayTypes,
} from '../displayTypes'
import {GraphVizLink} from './lib/Links'
import {GraphVizNode} from './lib/Nodes'
import {TooltipNode} from './NodeTooltips'
import {NodeFillPalette, NodeOutlinePalette} from './vizUtils'

export const artifactToNode = (artifact: Artifact): Partial<GraphVizNode> => ({
  id: artifact.getUid()!.getValue(),
  fill: NodeFillPalette.artifact,
  stroke: NodeOutlinePalette.artifact,
  strokeWidth: 0.03,
  strokeOpacity: 1.0,
})

export const artifactToTooltipNode = (
  artifact: Artifact,
): Partial<TooltipNode> => ({
  displayName: getArtifactNodeLabel(artifact.getType()),
})

export const attributeToNode = (
  attribute: Attribute,
): Partial<GraphVizNode> => ({
  id: `${getAttributeNodeLabel(attribute.getType())}::${attribute.getValue()}`,
  fill: NodeFillPalette.attribute,
  stroke: NodeOutlinePalette.attribute,
  strokeWidth: 0.03,
  strokeOpacity: 1.0,
})

export const attributeToTooltipNode = (
  attribute: Attribute,
): Partial<TooltipNode> => ({
  displayName: getAttributeNodeLabel(attribute.getType()),
})

export const observableToNode = (
  observable: ObservableNode,
): Partial<GraphVizNode> => {
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

export const eventToNode = (event: Event): Partial<GraphVizNode> => ({
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

  return {
    displayName,
  }
}

interface PartialGraphVizData {
  nodes: Partial<GraphVizNode>[]
  links: Partial<GraphVizLink>[]
}

export const eventsToVizData = (
  events: Event[],
): {
  graphData: PartialGraphVizData
  tooltipsNodes: Partial<TooltipNode>[]
} => {
  // We want a deduped list of all nodes, because they can be repeated. We'll
  // build that up in this object:
  const seenVizNodesById: {
    [id: string]: {
      vizNode: Partial<GraphVizNode>
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
        tooltipNode: attributeToTooltipNode(ao.getAttribute()!),
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
        tooltipNode: observableToTooltipNode(rel.getFrom()!),
      }

      const to = observableToNode(rel.getTo()!)
      seenVizNodesById[to.id!] = {
        vizNode: to,
        tooltipNode: observableToTooltipNode(rel.getTo()!),
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
    graphData: {
      nodes: seenNodes.map(it => it.vizNode),
      links,
    },
    tooltipsNodes: seenNodes.map(it => it.tooltipNode),
  }
}
