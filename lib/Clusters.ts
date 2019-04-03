import {GraphVizNode} from './Nodes'
import {pickBy} from 'lodash'
import * as THREE from 'three'
import {MeshBasicMaterial} from 'three'
import {get2DConvexHull, getNiceOffsetPolygon} from './convexHull'

export interface GraphVizCluster {
  id: string | number
  /**
   * node fill color hex string or hex number
   * (default is 0x333333)
   */
  fill?: number | string

  /**
   * relative node fill opacity
   * (must be between 0.0 - 1.0)
   */
  fillOpacity?: number

  /**
   * inner padding from the boundary nodes
   */
  padding?: number
}

export const DEFAULT_CLUSTER_FILL = 0x000000
export const DEFAULT_CLUSTER_FILL_OPACITY = 0.09

export class Clusters {
  public object = new THREE.Group()
  private meshes: {[clusterId: string]: THREE.Mesh | THREE.Points} = {}

  constructor(nodes: GraphVizNode[], clusters: GraphVizCluster[]) {
    this.updateAll(nodes, clusters)
  }

  public updateAll(nodes: GraphVizNode[], clusters: GraphVizCluster[]) {
    const nodesByClusters = this.groupNodesByClusters(nodes)

    for (const cluster of clusters) {
      const nodesInCluster = nodesByClusters[cluster.id]
      if (!nodesInCluster) {
        continue
      }
      const convexHull = get2DConvexHull(nodesInCluster) as GraphVizNode[]
      const vertices = getNiceOffsetPolygon(convexHull, cluster.padding)

      let geometry

      // if new cluster
      if (this.meshes[cluster.id] === undefined) {
        // NOTE: we probably don't need a BufferGeometry after r102 amirite?
        geometry = new THREE.Geometry()
        const material = new MeshBasicMaterial({
          color: cluster.fill || DEFAULT_CLUSTER_FILL,
          opacity: cluster.fillOpacity || DEFAULT_CLUSTER_FILL_OPACITY,
          transparent: true,
        })
        this.meshes[cluster.id] = new THREE.Mesh(geometry, material)
        this.object.add(this.meshes[cluster.id])
      } else {
        geometry = this.meshes[cluster.id].geometry as THREE.Geometry
      }

      geometry.setFromPoints(vertices)

      const faces: any = []
      for (let i = 0; i < geometry.vertices.length - 2; i++) {
        faces.push(new THREE.Face3(0, i + 1, i + 2))
      }

      geometry.faces = faces
      geometry.computeBoundingSphere()
      geometry.elementsNeedUpdate = true
    }
  }

  public groupNodesByClusters(
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
    return pickBy(nodesByClusters, nodesInCluster => nodesInCluster.length > 2)
  }
}
