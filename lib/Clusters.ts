import {GraphVizNode} from './Nodes'
import {map} from 'lodash'
import * as THREE from 'three'
import {MeshBasicMaterial} from 'three'
import 'three/examples/js/QuickHull'
import 'three/examples/js/geometries/ConvexGeometry'
import 'three/examples/js/controls/OrbitControls'

(window as any).THREE = THREE

export class Clusters {
  public object = new THREE.Group()
  private meshes: {[clusterId: string]: THREE.Mesh} = {}

  constructor(nodes: GraphVizNode[]) {
    this.updateAll(nodes)
  }

  public updateAll(nodes: GraphVizNode[]) {
    const nodesByClusters = this.getClusters(nodes)

    map(nodesByClusters, (nodesInCluster, clusterId) => {
      if (this.meshes[clusterId] === undefined) {
        if (nodesInCluster.length < 4) {
          return
        }
        const nodePositions = nodesInCluster.map(
          (n: any) => new THREE.Vector3(n.x, n.y, n.z),
        )
        console.log(nodePositions)
        const geometry = new (THREE as any).ConvexGeometry(nodePositions)
        const material = new MeshBasicMaterial({color: 0xff00ff, opacity: 0.3})
        this.meshes[clusterId] = new THREE.Mesh(geometry, material)
        this.meshes[clusterId].name = clusterId
        this.object.add(this.meshes[clusterId])
      } else {
        const nodePositions = nodesInCluster.map(
          (n: any) => new THREE.Vector3(n.x, n.y, n.z),
        )
        const geometry = new (THREE as any).ConvexGeometry(nodePositions)
        this.meshes[clusterId].geometry = geometry
        this.object.add(this.meshes[clusterId])
      }

      // const convexHull = get2DConvexHull(nodesInCluster)
      // console.log(clusterId, convexHull)
      //
      // // if new cluster
      // if (this.meshes[clusterId] === undefined) {
      //   const geom = new THREE.BufferGeometry()
      //   geom.addAttribute(
      //     'position',
      //     new Float32Array(convexHull.length * 3),
      //     3,
      //   )
      //
      //   const material = new MeshBasicMaterial({color: 0xff00ff, opacity: 0.3})
      //
      //   this.meshes[clusterId] = new THREE.Mesh(geom, material)
      //   this.meshes[clusterId].name = clusterId
      //   this.object.add(this.meshes[clusterId])
      // }
      //
      // const geometry = this.meshes[clusterId].geometry as THREE.BufferGeometry
      // const position = geometry.getAttribute(
      //   'position',
      // ) as THREE.BufferAttribute
      //
      // position.setArray(new Float32Array(position.itemSize * convexHull.length))
      //
      // for (let i = 0; i < convexHull.length; i++) {
      //   position.setXYZ(i, convexHull[i].x!, convexHull[i].y!, 0)
      // }
      //
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
    return nodesByClusters
  }
}
