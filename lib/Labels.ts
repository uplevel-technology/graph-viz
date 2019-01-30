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
          new THREE.PlaneBufferGeometry(1, 1),
          new THREE.MeshBasicMaterial({color: 0xFF00FF}),
        )
        this.meshes[index] = mesh
        this.object.add(mesh)
      }

      mesh.position.x = (link.source.x + link.target.x) / 2
      mesh.position.y = (link.source.y + link.target.y) / 2

      const dx = link.target.x - link.source.x
      const dy = link.target.y - link.source.y

      mesh.rotation.z = Math.atan2(dy, dx)

      const linkLength = Math.sqrt(dx * dx + dy * dy)
      mesh.scale.x = Math.max(0, linkLength - 20)
      mesh.scale.y = 10
    })
  }
}
