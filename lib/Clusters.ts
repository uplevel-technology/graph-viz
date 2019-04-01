import {GraphVizNode} from './Nodes'
import {map, pickBy} from 'lodash'
import * as THREE from 'three'
import {MeshBasicMaterial} from 'three'
import {get2DConvexHull, getNiceOffsetPolygon} from './convexHull'

export class Clusters {
  public object = new THREE.Group()
  private meshes: {[clusterId: string]: THREE.Mesh | THREE.Points} = {}

  constructor(nodes: GraphVizNode[]) {
    this.updateAll(nodes)
  }

  public updateAll(nodes: GraphVizNode[]) {
    const nodesByClusters = this.getClusters(nodes)

    map(nodesByClusters, (nodesInCluster, clusterId) => {
      const convexHull = get2DConvexHull(nodesInCluster)
      const vertices = getNiceOffsetPolygon(convexHull)

      let geometry
      let pointsGeometry

      // if new cluster
      if (this.meshes[clusterId] === undefined) {
        // NOTE: we probably don't need a BufferGeometry after r102 amirite?
        geometry = new THREE.Geometry()
        pointsGeometry = new THREE.Geometry()
        const material = new MeshBasicMaterial({
          color: 0xff00ff,
          opacity: 0.3,
          polygonOffset: true,
          polygonOffsetFactor: 100,
          polygonOffsetUnits: 10,
        })
        const pointsMat = new THREE.PointsMaterial({size: 5, color: 0xff0000})
        this.meshes[clusterId] = new THREE.Mesh(geometry, material)
        this.meshes[`helper-${clusterId}`] = new THREE.Points(
          pointsGeometry,
          pointsMat,
        )
        this.object.add(this.meshes[clusterId])
        this.object.add(this.meshes[`helper-${clusterId}`])
      } else {
        geometry = this.meshes[clusterId].geometry as THREE.Geometry
        pointsGeometry = this.meshes[`helper-${clusterId}`]
          .geometry as THREE.Geometry
      }

      geometry.setFromPoints(vertices)
      pointsGeometry.vertices = vertices.map(
        v => new THREE.Vector3(v.x, v.y, 0),
      )

      const faces: any = []
      for (let i = 0; i < geometry.vertices.length - 2; i++) {
        faces.push(new THREE.Face3(0, i + 1, i + 2))
      }
      geometry.faces = faces
      geometry.computeBoundingSphere()

      geometry.elementsNeedUpdate = true
      pointsGeometry.elementsNeedUpdate = true
      pointsGeometry.verticesNeedUpdate = true
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
