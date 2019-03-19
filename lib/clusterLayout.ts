import {GraphVizNode} from './Nodes'
import {GraphVizCluster} from './Clusters'
import {map} from 'lodash'
import {PartialGraphVizNode} from '../GraphVizComponent'

export function getClusters(nodes: PartialGraphVizNode[]): GraphVizCluster[] {
  const nodesByClusters: {[clusterId: string]: PartialGraphVizNode[]} = {}

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

      const diameter = Math.sqrt(
        Math.pow(xMax - xMin, 2) + Math.pow(yMax - yMin, 2),
      )

      const centerX = xMin + diameter / 2
      const centerY = yMin + diameter / 2

      console.log(diameter)

      return {
        id: clusterId,
        x: centerX,
        y: centerY,
        fill: 'bisque',
        absoluteSize: diameter * 10,
      }
    },
  )

  return clusters as GraphVizCluster[]
}
