import * as THREE from 'three'
import { PopulatedGraphVizLink } from './Links'

export class Labels {
  public object: THREE.Object3D
  private readonly meshes: {[linkIndex: number]: THREE.Mesh}

  constructor() {
    this.object = new THREE.Object3D()
    this.meshes = {}
  }

  public updateAll(links: PopulatedGraphVizLink[]) {
    links.forEach((link, index) => {
      let mesh = this.meshes[index]

      if (!link.label) {
        if (mesh) {
          this.object.remove(mesh)
          delete this.meshes[index]
        }
        return
      }

      if (!mesh) {
        mesh = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(20, 10),
          new THREE.MeshBasicMaterial({color: 0xFF00FF}),
        )
        this.meshes[index] = mesh
        this.object.add(mesh)
      }

      mesh.position.x = (link.source.x + link.target.x) / 2
      mesh.position.y = (link.source.y + link.target.y) / 2
    })
  }
}
