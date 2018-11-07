import {GraphViz} from '@core/ontology/graph_viz_pb'
import {ObservableNode} from '@core/ontology/observable_pb'
import {Attribute} from '@core/ontology/attribute_pb'
import {Artifact} from '@core/ontology/artifact_pb'
import {VisualGraphLink, VisualGraphNode} from './lib/GraphVisualization'
import {findKey, map} from 'lodash'

export const graphNodePalette = {
  alert: '#098E85',
  incident: '#56D48E',
  indicator: '#E7465A',
  observable: '#FEC400',
  target: '#00478D',
  threat: '#3696F6',
}

// Temp hacky types introduced here until we decide on the right format from the backend
interface TmpVizNode {
  parentType: 'artifact' | 'attribute'
  type: string
  vizId: string
}

interface TmpVizLink {
  from: TmpVizNode
  to: TmpVizNode
}

interface TmpVizGraph {
  nodes: TmpVizNode[]
  links: TmpVizLink[]
}

const formatVizNode = (node: ObservableNode): TmpVizNode => {
  switch (node.getValueCase()) {
  case ObservableNode.ValueCase.ARTIFACT:
    const artifact = node.getArtifact()
    return {
      parentType: 'artifact',
      type: findKey(Artifact.Type, (t) => t === artifact.getType()),
      vizId: artifact.getUid(),
    }
  case ObservableNode.ValueCase.ATTRIBUTE:
    const attribute = node.getAttribute()
    return {
      parentType: 'attribute',
      type: findKey(Attribute.Type, (t) => t === attribute.getType()),
      vizId: attribute.getValue(),
    }
  case ObservableNode.ValueCase.VALUE_NOT_SET:
    throw new Error('ObservableNode value not set')
  default:
    // This should happen when a new ObservableNode type was added to the proto
    // but not updated here.
    throw new Error('Unknown ObservableNode value:' + node.getValueCase())
  }
}

export const formatVizData = (graphViz: GraphViz): TmpVizGraph => {
  const nodes = map(graphViz.getNodesList(), formatVizNode)

  const links = map(graphViz.getLinksList(), (link) => ({
    from: formatVizNode(link.getFrom()),
    to: formatVizNode(link.getTo()),
  }))

  return {nodes, links}
}

export const transformNode = (node: TmpVizNode): VisualGraphNode => ({
  _id: node.vizId, // TODO fix interface VisualGraphNode
  _type: node.type, // TODO fix interface VisualGraphNode
  fill: node.parentType === 'artifact' ? graphNodePalette.target : graphNodePalette.observable,
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
