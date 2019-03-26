// We could use Vector2 but trying to to couple this with THREE js for no reason
interface Point {
  x: number
  y: number
}

/**
 * Returns points on the convex hull of the given set of co-planar points.
 * The convex hull excludes collinear points.
 *
 * This function is an implementation of the Monotone Chain Algorithm (A.M Andrew, 1979)
 * and runs in O(n log(n)) time.
 *
 * @param points
 */
export function get2DConvexHull(points: Point[]): Point[] {
  // 1. Sort points first by x-coordinate, and in case of a tie, by y-coordinate
  const sortedPoints = [...points].sort(byPosition)

  if (sortedPoints.length <= 1) {
    return sortedPoints.slice()
  }

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

  // if (
  //   upperHull.length === 1 &&
  //   lowerHull.length === 1 &&
  //   upperHull[0].x === lowerHull[0].x &&
  //   upperHull[0].y === lowerHull[0].y
  // ) {
  //   return upperHull
  // } else {
  //   return upperHull.concat(lowerHull)
  // }
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

function byPosition(a: Point, b: Point): number {
  if (a.x === b.x) {
    return a.y - b.y
  }
  return a.x - b.x
}
