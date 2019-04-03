import {GraphVizNode} from './Nodes'
import {map, pickBy} from 'lodash'
import * as THREE from 'three'
import {MeshBasicMaterial} from 'three'
import {get2DConvexHull, getNiceOffsetPolygon} from './convexHull'

interface GraphVizCluster {
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

export class Clusters {
  public object = new THREE.Group()
  private meshes: {[clusterId: string]: THREE.Mesh | THREE.Points} = {}

  constructor(nodes: GraphVizNode[]) {
    this.updateAll(nodes)
  }

  public updateAll(nodes: GraphVizNode[]) {
    const nodesByClusters = this.getClusters(nodes)

    map(nodesByClusters, (nodesInCluster, clusterId) => {
      const convexHull = get2DConvexHull(nodesInCluster) as GraphVizNode[]
      const vertices = getNiceOffsetPolygon(convexHull)

      let geometry

      // if new cluster
      if (this.meshes[clusterId] === undefined) {
        // NOTE: we probably don't need a BufferGeometry after r102 amirite?
        geometry = new THREE.Geometry()
        const material = new MeshBasicMaterial({
          color: 0xff00ff,
          opacity: 0.1,
          transparent: true,
        })
        this.meshes[clusterId] = new THREE.Mesh(geometry, material)
        this.object.add(this.meshes[clusterId])
      } else {
        geometry = this.meshes[clusterId].geometry as THREE.Geometry
      }

      geometry.setFromPoints(vertices)

      const faces: any = []
      for (let i = 0; i < geometry.vertices.length - 2; i++) {
        faces.push(new THREE.Face3(0, i + 1, i + 2))
      }
      geometry.faces = faces
      geometry.computeBoundingSphere()

      geometry.elementsNeedUpdate = true
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
    return pickBy(nodesByClusters, nodesInCluster => nodesInCluster.length > 2)
  }
}
