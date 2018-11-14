import {GraphViz} from '@core/ontology/graph_viz_pb'
import {ObservableNode} from '@core/ontology/observable_pb'
import {VisualGraphLink, VisualGraphNode} from './lib/GraphVisualization'
import {ArtifactDisplayTypes, AttributeDisplayTypes} from '../displayTypes'
import {map} from 'lodash'

export const graphNodePalette = {
  artifact: '#00478D',
  attribute: '#FEC400',
}

// Temp hacky types introduced here until we decide on the right format from the backend
interface TmpVizNode {
  type: 'artifact' | 'attribute'
  subType: string // technically, could reduce this down to the set of Artifact.Type | Attribute.Type
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

const formatVizNode = (node: ObservableNode): TmpVizNode => {
  switch (node.getValueCase()) {
  case ObservableNode.ValueCase.ARTIFACT:
    const artifact = node.getArtifact()
    return {
      type: 'artifact',
      subType: ArtifactDisplayTypes[artifact.getType()],
      vizId: artifact.getUid(),
    }
  case ObservableNode.ValueCase.ATTRIBUTE:
    const attribute = node.getAttribute()
    return {
      type: 'attribute',
      subType: AttributeDisplayTypes[attribute.getType()],
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
  _type: node.subType, // TODO fix interface VisualGraphNode
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
