import * as THREE from 'three'
import {GraphVizNode} from './Nodes'
import {PartialGraphVizNode} from '../GraphVizComponent'

const getClusters = (
  nodes: GraphVizNode[],
): {[clusterId: string]: PartialGraphVizNode[]} => {
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

  return nodesByClusters
}

export class ConvexHullCluster {
  public object: THREE.Points

  private geometries: THREE.BufferGeometry[] = []
  private material: THREE.MeshBasicMaterial

  constructor(nodes: GraphVizNode[]) {
    const clusters = getClusters(nodes)

    for (const id in clusters) {
      const nodesInCluster = clusters[id]

      const points = nodesInCluster.map(
        node => new THREE.Vector3(node.x, node.y, 0),
      )
      const geometry = new THREE.ConvexGeometry(points)
      const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
      const mesh = new THREE.Mesh(geometry, material)

      this.geometries.push()
    }
  }
}
