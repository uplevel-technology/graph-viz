import {meanBy} from 'lodash'

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

  const hull = [...upperHull, ...lowerHull]
  const centroid = getCentroid(hull)

  const paddedHull = hull.map(vertex => {
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
      x: paddedX,
      y: paddedY,
    }
  })

  return paddedHull
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
