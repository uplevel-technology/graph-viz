import * as THREE from 'three'
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from 'three'

/**
 * Simple rectangle drawn between two diametrically opposite control points - origin and transverse
 * Used during dragSelection.
 */
export class SelectionRectangle {
  public object: THREE.Mesh

  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.MeshBasicMaterial

  constructor() {
    this.geometry = new BufferGeometry()
    this.geometry.setAttribute(
      'position',
      new BufferAttribute(
        // this is a sample position which is overwritten when in the draw function.
        // The only purpose is for self-documentation
        Float32Array.from([
          // Triangle 1
          // A 0 Origin
          -1,
          1,
          0,
          // B 1
          1,
          1,
          0,
          // C 2 Transverse
          1,
          -1,
          0,
          // Triangle 2
          // D 3
          -1,
          -1,
          0,
          // A' 4 Origin'
          -1,
          1,
          0,
          // C' 5 Transverse'
          1,
          -1,
          0,
        ]),
        3,
      ),
    )
    this.material = new MeshBasicMaterial({
      color: '#1495dd',
      opacity: 0.1,
      transparent: true,
      side: THREE.DoubleSide,
    })
    this.object = new Mesh(this.geometry, this.material)
  }

  // sets the origin control point
  public setOrigin(pos: Vector3) {
    const posAttr = this.geometry.getAttribute('position') as BufferAttribute

    for (let i = 0; i < posAttr.count; i++) {
      // initialize all vertices to the origin
      posAttr.setXY(i, pos.x, pos.y)
    }
    posAttr.needsUpdate = true
  }

  // updates the transverse control point and the rectangle
  public updateTransverse(pos: Vector3) {
    const posAttr = this.geometry.getAttribute('position') as BufferAttribute
    // triangle ABC
    posAttr.setX(1, pos.x) // b
    posAttr.setXY(2, pos.x, pos.y) // c
    // triangle DCA
    posAttr.setY(3, pos.y) // d
    posAttr.setXY(5, pos.x, pos.y) // c'
    posAttr.needsUpdate = true
  }
}
