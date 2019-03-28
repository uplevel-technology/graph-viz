import {DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE, GraphVizNode} from './Nodes'
import {map, pickBy} from 'lodash'
import * as THREE from 'three'
import {MeshBasicMaterial} from 'three'
import {get2DConvexHull} from './convexHull'

export class Clusters {
  public object = new THREE.Group()
  private meshes: {[clusterId: string]: THREE.Mesh} = {}

  constructor(nodes: GraphVizNode[]) {
    this.updateAll(nodes)
  }

  public updateAll(nodes: GraphVizNode[]) {
    const nodesByClusters = this.getClusters(nodes)

    map(nodesByClusters, (nodesInCluster, clusterId) => {
      // if (this.meshes[clusterId] === undefined) {
      //   if (nodesInCluster.length < 4) {
      //     return
      //   }
      //   const nodePositions = nodesInCluster.map(
      //     (n: any) => new THREE.Vector3(n.x, n.y, n.z),
      //   )
      //   console.log(nodePositions)
      //   const geometry = new (THREE as any).ConvexGeometry(nodePositions)
      //   const material = new MeshBasicMaterial({color: 0xff00ff, opacity: 0.3})
      //   this.meshes[clusterId] = new THREE.Mesh(geometry, material)
      //   this.meshes[clusterId].name = clusterId
      //   this.object.add(this.meshes[clusterId])
      // } else {
      //   const nodePositions = nodesInCluster.map(
      //     (n: any) => new THREE.Vector3(n.x, n.y, n.z),
      //   )
      //   const geometry = new (THREE as any).ConvexGeometry(nodePositions)
      //   this.meshes[clusterId].geometry = geometry
      //   this.object.add(this.meshes[clusterId])
      // }

      const convexHull = get2DConvexHull(
        nodesInCluster.map(n => ({
          ...n,
          radius: n.absoluteSize || DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE,
        })),
      )

      // if new cluster
      if (this.meshes[clusterId] === undefined) {
        // NOTE: we probably don't need a BufferGeometry after r102 amirite?
        const geometry = new THREE.Geometry()

        geometry.vertices = convexHull.map(n => new THREE.Vector3(n.x, n.y, 0))

        const faces: any = []
        for (let i = 0; i < geometry.vertices.length - 2; i++) {
          faces.push(new THREE.Face3(0, i + 1, i + 2))
        }
        geometry.faces = faces
        geometry.computeBoundingSphere()

        const material = new MeshBasicMaterial({color: 0xff00ff, opacity: 0.3})
        this.meshes[clusterId] = new THREE.Mesh(geometry, material)
        this.object.add(this.meshes[clusterId])
      } else {
        const geometry = this.meshes[clusterId].geometry as THREE.Geometry

        geometry.vertices = convexHull.map(n => new THREE.Vector3(n.x, n.y, 0))

        const faces: any = []
        for (let i = 0; i < geometry.vertices.length - 2; i++) {
          faces.push(new THREE.Face3(0, i + 1, i + 2))
        }
        geometry.faces = faces
        geometry.computeBoundingSphere()

        geometry.elementsNeedUpdate = true
      }

      // position.needsUpdate = true

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
    return pickBy(nodesByClusters, nodesInCluster => nodesInCluster.length > 2)
  }
}
