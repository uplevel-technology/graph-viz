import {GraphVizNode} from './Nodes'
import {map} from 'lodash'
import * as THREE from 'three'
import {MeshBasicMaterial} from 'three'
import {get2DConvexHull} from './convexHull'

export class Clusters {
  public object = new THREE.Group()

  private meshes: {[clusterId: string]: THREE.Mesh} = {}

  private readonly geometries: THREE.BufferGeometry
  private readonly materials: THREE.ShaderMaterial

  constructor(nodes: GraphVizNode[]) {
    this.updateAll(nodes)
  }

  public updateAll(nodes: GraphVizNode[]) {
    const nodesByClusters = this.getClusters(nodes)

    map(nodesByClusters, (nodesInCluster, clusterId) => {
      const convexHull = get2DConvexHull(nodesInCluster)

      // if new cluster
      if (this.meshes[clusterId] === undefined) {
        const geom = new THREE.BufferGeometry()
        geom.addAttribute(
          'position',
          new Float32Array(convexHull.length * 3),
          3,
        )

        const material = new MeshBasicMaterial({color: 0xff00ff, opacity: 0.3})

        this.meshes[clusterId] = new THREE.Mesh(geom, material)
        this.meshes[clusterId].name = clusterId
        this.object.add(this.meshes[clusterId])
      }

      const geometry = this.meshes[clusterId].geometry as THREE.BufferGeometry
      const position = geometry.getAttribute(
        'position',
      ) as THREE.BufferAttribute

      if (convexHull.length !== position.count) {
        position.setArray(
          new Float32Array(position.itemSize * convexHull.length),
        )
      }

      for (let i = 0; i < convexHull.length; i++) {
        position.setXYZ(i, convexHull[i].x!, convexHull[i].y!, 0)
      }

      position.needsUpdate = true

      // We would need this if we were to detect interactions
      // on Clusters
      // geometry.computeBoundingSphere()
    })
  }

  public getClusters(
    nodes: GraphVizNode[],
  ): {[clusterId: string]: GraphVizNode[]} {
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
    return nodesByClusters
  }
}
