import {GraphVizNode} from './Nodes'
import {map} from 'lodash'
import {PartialGraphVizNode} from '../GraphVizComponent'

interface NodeWithPosition extends PartialGraphVizNode {
  x: number
  y: number
}

/**
 * this doesn't really find the convex hull
 * it only calculates the maximum distance between two points
 * in a given array of points in a bad/brute-force O(N2) fashion
 * @param nodes
 */

interface ConvexHull {
  nodes: NodeWithPosition[]
  center: {x: number; y: number}
  diameter: number
}

function getConvexHull(nodes: NodeWithPosition[]): ConvexHull {
  const hull: ConvexHull = {
    nodes: [],
    center: {x: 0, y: 0},
    diameter: 0,
  }

  if (nodes.length < 2) {
    return hull
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const {x: x1, y: y1} = nodes[i]
      const {x: x2, y: y2} = nodes[j]

      const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
      if (distance > hull.diameter) {
        hull.diameter = distance
        hull.nodes = [nodes[i], nodes[j]]
        hull.center = {
          x: (x1 + x2) / 2,
          y: (y1 + y2) / 2,
        }
      }
    }
  }

  return hull
}

type GraphVizCluster = GraphVizNode
export function getClusters(nodes: NodeWithPosition[]): GraphVizCluster[] {
  const nodesByClusters: {[clusterId: string]: NodeWithPosition[]} = {}

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
      const convexHull = getConvexHull(nodesInCluster)

      return {
        id: clusterId,
        x: convexHull.center.x,
        y: convexHull.center.y,
        fill: 'lemonchiffon',
        fillOpacity: 0.5,
        stroke: 'blue',
        strokeWidth: 0.005,
        strokeOpacity: 0.5,
        absoluteSize: convexHull.diameter * 2 + 150, // multiply by 2 to compensate for the relative radius inside. sad.
      }
    },
  )

  return clusters as GraphVizCluster[]
}
