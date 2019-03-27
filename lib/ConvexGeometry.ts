import * as THREE from 'three'

export class ConvexGeometry extends THREE.Geometry {
  constructor(points) {
    super()

    this.fromBufferGeometry(new ConvexBufferGeometry(points))
    this.mergeVertices()
  }
}
// ConvexBufferGeometry

export class ConvexBufferGeometry extends THREE.BufferGeometry {
  constructor(points) {
    super()

    // buffers

    const vertices = []
    const normals = []

    // execute QuickHull

    if (THREE.QuickHull === undefined) {
      console.error(
        'THREE.ConvexBufferGeometry: ConvexBufferGeometry relies on THREE.QuickHull',
      )
    }

    const quickHull = new THREE.QuickHull().setFromPoints(points)

    // generate vertices and normals

    const faces = quickHull.faces

    for (const face of faces) {
      let edge = face.edge

      // we move along a doubly-connected edge list to access all face points (see HalfEdge docs)

      do {
        const point = edge.head().point

        vertices.push(point.x, point.y, point.z)
        normals.push(face.normal.x, face.normal.y, face.normal.z)

        edge = edge.next
      } while (edge !== face.edge)
    }

    // build geometry

    this.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    this.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  }
}
