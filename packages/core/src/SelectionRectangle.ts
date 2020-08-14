import * as THREE from 'three'
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from 'three'

/**
 * Simple rectangle drawn between two diagonally opposite control points - start and end
 * Used during dragSelection.
 */
export class SelectionRectangle {
  public object: THREE.Mesh

  private readonly frustum: THREE.Frustum
  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.MeshBasicMaterial
  private readonly camera: THREE.OrthographicCamera

  constructor(camera: THREE.OrthographicCamera) {
    this.camera = camera
    this.geometry = new BufferGeometry()
    this.geometry.setAttribute(
      'position',
      new BufferAttribute(
        // this is a sample position which is overwritten when in the draw function.
        // The only purpose is for self-documentation
        Float32Array.from([
          // Triangle 1
          // A 0 Start point
          -1,
          1,
          0,
          // B 1
          1,
          1,
          0,
          // C 2 End point
          1,
          -1,
          0,
          // Triangle 2
          // D 3
          -1,
          -1,
          0,
          // A' 4 Start' point
          -1,
          1,
          0,
          // C' 5 End' point
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
    this.object.frustumCulled = false
  }

  // sets the start control point
  public setStart(start: Vector3) {
    const posAttr = this.geometry.getAttribute('position') as BufferAttribute

    for (let i = 0; i < posAttr.count; i++) {
      // initialize all vertices to the start point
      posAttr.setXYZ(i, start.x, start.y, start.z)
    }
    posAttr.needsUpdate = true
  }

  // sets the end control point
  public setEnd(end: Vector3) {
    const posAttr = this.geometry.getAttribute('position') as BufferAttribute
    // triangle ABC
    posAttr.setX(1, end.x) // b
    posAttr.setXY(2, end.x, end.y) // c
    // triangle DCA
    posAttr.setY(3, end.y) // d
    posAttr.setXY(5, end.x, end.y) // c'
    posAttr.needsUpdate = true
  }
}
