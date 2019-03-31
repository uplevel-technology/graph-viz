import {meanBy} from 'lodash'
import * as THREE from 'three'

interface Point {
  x: number
  y: number
  radius?: number
}

/**
 * predicate to sort two points by x and y coordinates
 * @param a
 * @param b
 */
function byPosition(a: Point, b: Point): number {
  if (a.x === b.x) {
    return a.y - b.y
  }
  return a.x - b.x
}

/**
 * Returns points on the convex hull of the given set of co-planar points.
 * The convex hull excludes collinear points.
 *
 * This function is an implementation of the Monotone Chain Algorithm (A.M Andrew, 1979)
 * and runs in O(n log(n)) time.
 *
 * If input has less than three points, it trivially runs in constant time.
 *
 * Alternatively you can provide a padding for the output convex polygon
 *
 * @param points
 * @param padding
 */
export function get2DConvexHull(points: Point[], padding: number = 0): Point[] {
  if (points.length < 3) {
    return points
  }

  // 1. Sort points first by x-coordinate, and in case of a tie, by y-coordinate
  const sortedPoints = [...points].sort(byPosition)

  // 2. Compute the upper hull
  const upperHull: Point[] = []
  for (const p of sortedPoints) {
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1]
      const o = upperHull[upperHull.length - 2]
      // remove point from the upper hull if we see a clockwise turn
      if (cross(o, q, p) <= 0) {
        upperHull.pop()
      } else {
        break
      }
    }
    upperHull.push(p)
  }

  // 3. Computer the lower hull
  const lowerHull: Point[] = []
  for (let i = sortedPoints.length - 1; i >= 0; i--) {
    const p = sortedPoints[i]
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1]
      const o = lowerHull[lowerHull.length - 2]
      // add point from the lower hull if we see a clockwise turn
      if (cross(o, q, p) <= 0) {
        lowerHull.pop()
      } else {
        break
      }
    }
    lowerHull.push(p)
  }

  // remove the node you counted twice in both hulls
  upperHull.pop()
  lowerHull.pop()

  return [...upperHull, ...lowerHull]
}

/**
 * Returns the 2D cross product of OP and OQ vectors,
 * i.e. z-component of their 3D cross product.
 * Returns a positive value, if vector OPQ makes a counter-clockwise turn,
 * negative for clockwise turn, and zero if the points are collinear.
 * @param o
 * @param p
 * @param q
 */
function cross(o: Point, p: Point, q: Point): number {
  return (p.x - o.x) * (q.y - o.y) - (p.y - o.y) * (q.x - o.x)
}

export function getCentroid(points: Point[]): Point {
  return {
    x: meanBy(points, p => p.x),
    y: meanBy(points, p => p.y),
  }
}

export function getPaddedConvexPolygon(
  vertices: Point[],
  padding: number = 0,
): THREE.Vector2[] {
  // the centroid of a convex polygon is guaranteed to be inside the polygon
  const centroid = getCentroid(vertices)
  console.log(vertices.map(v => (v as any).id))

  const allVertices: THREE.Vector2[] = []

  const paddedVertices = vertices.map(vertex => {
    const slope = (vertex.y - centroid.y) / (vertex.x - centroid.x)
    const offset = (vertex.radius || 0) + padding

    // this might be considerably more readable if we use THREE.Vector3 instead of Point
    // get a unit vector along vector CV where C = centroid and V = vertex
    // and add (the normalized vector scaled by the Offset)
    const directionX = vertex.x - centroid.x > 0 ? 1 : -1
    const paddedX =
      vertex.x +
      directionX * Math.sqrt(Math.pow(offset, 2) / (Math.pow(slope, 2) + 1))

    const paddedY = vertex.y + slope * (paddedX - vertex.x)

    return {
      ...vertex,
      x: paddedX,
      y: paddedY,
    }
  })

  const path = new THREE.Path()

  for (let i = 0; i < paddedVertices.length; i++) {
    const vertex = vertices[i]
    const paddedVertex = paddedVertices[i]
    const prevVertex =
      i === 0
        ? paddedVertices[paddedVertices.length - 1]
        : paddedVertices[i - 1]
    const nextVertex =
      i === paddedVertices.length - 1
        ? paddedVertices[0]
        : paddedVertices[i + 1]

    const prevSlope =
      (paddedVertex.y - prevVertex.y) / (paddedVertex.x - prevVertex.x)
    const nextSlope =
      (paddedVertex.y - nextVertex.y) / (paddedVertex.x - nextVertex.x)

    const prevAnchorX1 =
      (vertex.y - prevVertex.y + prevSlope * prevVertex.x) / prevSlope
    const prevAnchorY1 = vertex.y
    const prevAnchor1Dist = prevAnchorX1 - vertex.x

    const nextAnchorX1 = vertex.x
    const nextAnchorY1 = nextSlope * (vertex.x - nextVertex.x) + nextVertex.y
    const nextAnchor1Dist = nextAnchorY1 - vertex.y

    const proximity1 = prevAnchor1Dist + nextAnchor1Dist

    const prevAnchorX2 = vertex.x
    const prevAnchorY2 = prevSlope * (vertex.x - prevVertex.x) + prevVertex.y
    const prevAnchor2Dist = prevAnchorY2 - vertex.y

    const nextAnchorX2 =
      (vertex.y - nextVertex.y + nextSlope * nextVertex.x) / nextSlope
    const nextAnchorY2 = vertex.y
    const nextAnchor2Dist = nextAnchorX2 - vertex.x

    const proximity2 = prevAnchor2Dist + nextAnchor2Dist

    let prevAnchor = {
      x: prevAnchorX1,
      y: prevAnchorY1,
    }
    let nextAnchor = {
      x: nextAnchorX1,
      y: nextAnchorY1,
    }

    if (proximity2 < proximity1) {
      prevAnchor = {
        x: prevAnchorX2,
        y: prevAnchorY2,
      }
      nextAnchor = {
        x: nextAnchorX2,
        y: nextAnchorY2,
      }
    }

    const anchorPoints = [
      new THREE.Vector2(prevAnchor.x, prevAnchor.y),
      new THREE.Vector2(paddedVertex.x, paddedVertex.y),
      new THREE.Vector2(nextAnchor.x, nextAnchor.y),
    ]

    const spline = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(prevAnchor.x, prevAnchor.y),
      new THREE.Vector2(paddedVertex.x, paddedVertex.y),
      new THREE.Vector2(nextAnchor.x, nextAnchor.y),
    )

    // allVertices.push(...anchorPoints)
    allVertices.push(...spline.getPoints(200))
  }

  return allVertices
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}
