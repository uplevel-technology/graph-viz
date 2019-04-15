import * as THREE from 'three'
import {DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE, GraphVizNode} from './Nodes'
import {meanBy} from 'lodash'

interface Point {
  x: number
  y: number
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
 * @param points
 */
export function get2DConvexHull(points: Point[]): Point[] {
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

  // 3. Compute the lower hull
  const lowerHull: Point[] = []
  for (let i = sortedPoints.length - 1; i >= 0; i--) {
    const p = sortedPoints[i]
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1]
      const o = lowerHull[lowerHull.length - 2]
      // remove point from the lower hull if we see a clockwise turn
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
 *
 * NOTE: We could use THREE.Vector2().cross() instead of this function.
 *
 * @param o
 * @param p
 * @param q
 */
function cross(o: Point, p: Point, q: Point): number {
  return (p.x - o.x) * (q.y - o.y) - (p.y - o.y) * (q.x - o.x)
}

/**
 * Gets the rounded offset polygon.
 * ---------------------------------
 * This implementation is loosely based on the method highlighted in this
 * thread: https://discourse.threejs.org/t/offsetcontour-function/3185
 *
 * First, find the offset contour by using the bisector method:
 *
 * For each vertex V calculate the padded vertex:
 *  1. Find the bisector B for the outer angle between vectors V1→V and V2→V,
 *     where V1 and V2 are previous and next vertices respectively.
 *  2. Translate a point P = V along vector B for a distance of
 *     offset = node.radius + padding.
 *  3. Return P (the padded vertex)
 *
 * Then round the vertices:
 *
 * Replace each padded vertex with a QuadraticBezierCurve s.t.:
 * the paddedVertex P is the control point of the curve
 * and the intersection points of perpendiculars drawn from
 * vertex V to tangents V1→V and V2→V, are the start and the end points of the
 * curve respectively.
 *
 * @param nodes
 * @param padding
 */
export function getNiceOffsetPolygon(
  nodes: GraphVizNode[],
  padding: number = 0,
): THREE.Vector2[] {
  const vertices = nodes.map(n => new THREE.Vector2(n.x, n.y))

  const allVertices: THREE.Vector2[] = []

  const paddedVertices = vertices.map((v, i) => {
    // this assumes the array of vertices is in order and is circular
    const vPrev = i === 0 ? vertices[vertices.length - 1] : vertices[i - 1]
    const vNext = i === vertices.length - 1 ? vertices[0] : vertices[i + 1]

    const v1 = new THREE.Vector2().subVectors(vPrev, v)
    const v2 = new THREE.Vector2().subVectors(vNext, v)

    const angle = v2.angle() - v1.angle()

    const halfAngle = angle / 2
    const rHalfAngle = v2.angle() + Math.PI / 2

    const shift = Math.tan(halfAngle - Math.PI / 2) // shift by slope in the opposite direction

    // tslint:disable prettier
    const shiftMatrix = new THREE.Matrix4().set(
      1, 0, 0, 0,
      -shift, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    )

    const rotationMatrix = new THREE.Matrix4().set(
      Math.cos(rHalfAngle), -Math.sin(rHalfAngle), 0, 0,
      Math.sin(rHalfAngle),  Math.cos(rHalfAngle), 0, 0,
      0,                    0, 1, 0,
      0,                    0, 0, 1
    )

    const translationMatrix = new THREE.Matrix4().set(
      1, 0,  0, vertices[i].x,
      0, 1, 0, vertices[i].y,
      0, 0, 1, 0,
      0, 0, 0, 1,
    )
    // tslint:enable prettier

    const offset =
      (nodes[i].absoluteSize || DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE) +
      padding +
      nodes.length // add nodes.length to make offset proportional to display group size

    const offMag = (-offset * Math.sqrt(2)) / 2

    const offsetAttr = new THREE.BufferAttribute(
      new Float32Array([offMag, 0, 0]),
      3,
    )
    shiftMatrix.applyToBufferAttribute(offsetAttr)
    rotationMatrix.applyToBufferAttribute(offsetAttr)
    translationMatrix.applyToBufferAttribute(offsetAttr)

    return new THREE.Vector2(offsetAttr.getX(0), offsetAttr.getY(0))
  })

  for (let i = 0; i < paddedVertices.length; i++) {
    const vertex = vertices[i]
    const v = paddedVertices[i]
    const vPrev =
      i === 0
        ? paddedVertices[paddedVertices.length - 1]
        : paddedVertices[i - 1]
    const vNext =
      i === paddedVertices.length - 1
        ? paddedVertices[0]
        : paddedVertices[i + 1]

    const prevAnchor = findNormalViaIntersection(vPrev, v, vertex)
    const nextAnchor = findNormalViaIntersection(v, vNext, vertex)

    const curve = new THREE.QuadraticBezierCurve(prevAnchor, v, nextAnchor)

    allVertices.push(...curve.getPoints(10))
  }

  return allVertices
}

/**
 * gets the circular hull of a given list of points
 * @param points
 */
export function getCircularHull(
  points: Point[],
): {center: THREE.Vector2; radius: number} {
  const center = getCentroid(points)

  let maxDistance = 0
  let distance

  for (const point of points) {
    distance = getDistance(point, center)
    if (distance >= maxDistance) {
      maxDistance = distance
    }
  }

  return {
    center: new THREE.Vector2(center.x, center.y),
    radius: maxDistance,
  }
}

/**
 * gets the centroid of a given list of points
 * @param points
 */
export function getCentroid(points: Point[]): Point {
  return {
    x: meanBy(points, p => p.x),
    y: meanBy(points, p => p.y),
  }
}

/**
 * gets the distance between two points
 * @param a
 * @param b
 */
function getDistance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

/**
 * Finds the intersection point P of:
 *  1. The vector V1→V2, and,
 *  2. A vector normal to V1→V2 that passes through point "via".
 *
 * In other words, we drop a perpendicular on line V1→V2 at point P
 * that passes through point "via".
 * @param v1
 * @param v2
 * @param via
 */
function findNormalViaIntersection(
  v1: THREE.Vector2,
  v2: THREE.Vector2,
  via: THREE.Vector2,
): THREE.Vector2 {
  const slope = (v2.y - v1.y) / (v2.x - v1.x)
  const normalSlope = -1 / slope

  const c = v1.y - slope * v1.x
  const normalC = via.y - normalSlope * via.x

  const x = (c - normalC) / (normalSlope - slope)
  const y = slope * x + c

  return new THREE.Vector2(x, y)
}
