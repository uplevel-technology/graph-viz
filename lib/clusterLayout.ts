import {GraphVizNode} from './Nodes'
import {GraphVizCluster} from './Clusters'
import {map} from 'lodash'
import {PartialGraphVizNode} from '../GraphVizComponent'

export function getClusters(nodes: PartialGraphVizNode[]): GraphVizCluster[] {
  const nodesByClusters: {[clusterId: string]: GraphVizNode[]} = {}

  nodes.forEach(n => {
    if (n.clusterIds) {
      n.clusterIds.forEach(clusterId => {
        if (!nodesByClusters[clusterId]) {
          nodesByClusters[clusterId] = []
        }

        nodesByClusters[clusterId].push(n)
      })
    }
  })

  const clusters = map(
    nodesByClusters,
    (nodesInCluster: GraphVizNode[], clusterId: string) => {
      const xPositions = nodesInCluster.map(n => n.x).sort((a, b) => a - b)
      const yPositions = nodesInCluster.map(n => n.y).sort((a, b) => a - b)

      const xMin = xPositions[0]
      const xMax = xPositions[xPositions.length - 1]

      const yMin = yPositions[0]
      const yMax = yPositions[yPositions.length - 1]

      const diameter = Math.max(xMax - xMin, yMax - yMin)

      const centerX = xMin + diameter / 2
      const centerY = yMin + diameter / 2

      return {
        id: clusterId,
        x: centerX,
        y: centerY,
        fill: '#eeeeee',
        absoluteSize: diameter,
      }
    },
  )

  console.log(clusters)

  return clusters
}
