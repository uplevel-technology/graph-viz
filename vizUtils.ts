import {Attribute} from '@core/ontology/attribute_pb'
import {GraphViz} from '@core/ontology/graph_viz_pb'
import {Observable} from '@core/ontology/observable_pb'
import {VisualGraphLink, VisualGraphNode} from './GraphVisualization'
import {first, compact, values, omitBy, isNil, keys, map} from 'lodash'
import {Artifact} from '@core/ontology/artifact_pb'

export const graphNodePalette = {
  alert: '#098E85',
  incident: '#56D48E',
  indicator: '#E7465A',
  observable: '#FEC400',
  target: '#00478D',
  threat: '#3696F6',
}

type valueof<T> = T[keyof T]

// Temp hacky types introduced here until we decide on the right format from the backend
interface TmpVizNode {
  // TODO use enums from the proto definition
  // parentType?: valueof<Observable.ValueCase>
  // type?: valueof<Artifact.ValueCase> | valueof<Attribute.ValueCase>
  parentType?: 'artifact' | 'attribute'
  type?: string
  vizId?: string
  [key: string]: any
}

interface TmpVizLink {
  from: TmpVizNode
  to: TmpVizNode
}

interface TmpVizGraph {
  nodes: TmpVizNode[]
  links: TmpVizLink[]
}

// TODO: use proto directly to format
const formatVizNodeFromProto = (node: any): TmpVizNode => {
  const parentType = node.getValueCase()
  const type = node.getArtifact()

  return {

  }
}

const formatVizNode = (node: any): TmpVizNode => {
  const parentType = node.artifact ? 'artifact' : 'attribute'
  const obsNode = omitBy(node[parentType], isNil) // remove null/undefined values
  const type = first(keys(obsNode))

  return {
    parentType,
    type,
    vizId: node.artifact ? node[parentType][type].uid.value : node[parentType][type].value,
    ...node[parentType][type],
  }
}

export const formatVizData = (graphViz: GraphViz.AsObject): TmpVizGraph => {
  const nodes = map(graphViz.nodesList, formatVizNode)

  const links = map(graphViz.linksList, (link) => ({
    from: formatVizNode(link.from),
    to: formatVizNode(link.to),
  }))

  return {nodes, links}
}

export const transformNode = (node: TmpVizNode): VisualGraphNode => ({
  _id: node.vizId, // TODO fix interface VisualGraphNode
  _type: node.type.toString(), // TODO fix interface VisualGraphNode
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
