import {StyledNode} from './Nodes'
import * as THREE from 'three'
import {MeshBasicMaterial} from 'three'
import {ForceSimulationGroup} from './BasicForceSimulation'
import {
  get2DConvexHull,
  getCapsulePolygon,
  getCircularHull,
  getRoundedOffsetPolygon,
} from './hullGeometryUtils'

export interface VizDisplayGroup extends ForceSimulationGroup {
  isHighlighted: boolean

  /**
   * type of polygon to draw
   * default is convexHull
   */
  shape?: 'convexHull' | 'circle'

  /**
   * fill color hex string or hex number
   * (default is 0x333333)
   */
  fill?: number | string

  /**
   * relative node fill opacity
   * (must be between 0.0 - 1.0)
   */
  fillOpacity?: number

  /**
   * inner padding from the boundary nodes
   */
  padding?: number
}

export const DEFAULT_DISPLAY_GROUP_FILL = 0x000000
export const DEFAULT_DISPLAY_GROUP_FILL_OPACITY = 0.09

export class DisplayGroups {
  public object = new THREE.Group()
  private meshes: {[groupId: string]: THREE.Mesh} = {}

  constructor(nodes: StyledNode[], groups: VizDisplayGroup[]) {
    this.updateAll(nodes, groups)
  }

  public updateAll(nodes: StyledNode[], groups: VizDisplayGroup[]) {
    const nodesByGroup = this.getGroupedNodes(nodes)

    const renderedGroupIds = new Set()

    for (const group of groups) {
      const nodesInGroup = nodesByGroup[group.id]
      if (!nodesInGroup || nodesInGroup.length < 2) {
        continue
      }

      if (group.shape === 'circle') {
        this.renderCircle(group, nodesInGroup)
      } else {
        this.renderConvexHull(group, nodesInGroup)
      }

      renderedGroupIds.add(group.id)
    }

    // remove deleted display groups
    for (const groupId in this.meshes) {
      if (!renderedGroupIds.has(groupId)) {
        this.object.remove(this.meshes[groupId])
        delete this.meshes[groupId]
      }
    }
  }

  public getGroupedNodes(
    nodes: StyledNode[],
  ): {[groupId: string]: StyledNode[]} {
    const nodesByGroup: {[groupId: string]: StyledNode[]} = {}
    nodes.forEach(n => {
      if (n.displayGroupIds) {
        n.displayGroupIds.forEach(groupId => {
          if (!nodesByGroup[groupId]) {
            nodesByGroup[groupId] = []
          }

          nodesByGroup[groupId].push(n)
        })
      }
    })
    return nodesByGroup
  }

  private renderConvexHull(group: VizDisplayGroup, nodesInGroup: StyledNode[]) {
    const convexHull = get2DConvexHull(nodesInGroup) as StyledNode[]

    const vertices =
      nodesInGroup.length === 2
        ? // a capsule polygon is an offset polygon convex hull for 2 nodes
          getCapsulePolygon(nodesInGroup[0], nodesInGroup[1], group.padding)
        : getRoundedOffsetPolygon(convexHull, group.padding)

    let geometry

    // add new display group
    if (this.meshes[group.id] === undefined) {
      // NOTE: we probably don't need a BufferGeometry after r102 amirite?
      geometry = new THREE.Geometry()
      const material = new MeshBasicMaterial({
        color: group.fill || DEFAULT_DISPLAY_GROUP_FILL,
        opacity: group.fillOpacity || DEFAULT_DISPLAY_GROUP_FILL_OPACITY,
        transparent: true,
      })
      this.meshes[group.id] = new THREE.Mesh(geometry, material)
      this.object.add(this.meshes[group.id])
    } else {
      // update existing display group
      geometry = this.meshes[group.id].geometry as THREE.Geometry
    }

    geometry.setFromPoints(vertices)

    const faces: THREE.Face3[] = []
    for (let i = 0; i < geometry.vertices.length - 2; i++) {
      faces.push(new THREE.Face3(0, i + 1, i + 2))
    }

    geometry.faces = faces
    geometry.computeBoundingSphere()
    geometry.elementsNeedUpdate = true
  }

  private renderCircle(group: VizDisplayGroup, nodesInGroup: StyledNode[]) {
    const hull = getCircularHull(nodesInGroup)

    // add new display group
    if (this.meshes[group.id] === undefined) {
      // NOTE: This is an expensive way to render circles but it's ok for now
      // as we don't expect too many groups to be rendered simultaneously.
      // When the need arises, we can easily switch these over to a custom
      // circle shader material.

      // NOTE: Heuristically (hull.radius / 7) is  the smallest number I found
      // proportional to radius that prevents us from noticing a rough boundary.
      const segments = hull.radius / 7 + 32
      const evenSegments = Math.floor(segments / 2) * 2
      const geometry = new THREE.CircleGeometry(1.05, evenSegments)

      const material = new MeshBasicMaterial({
        color: group.fill || DEFAULT_DISPLAY_GROUP_FILL,
        opacity: group.fillOpacity || DEFAULT_DISPLAY_GROUP_FILL_OPACITY,
        transparent: true,
      })
      this.meshes[group.id] = new THREE.Mesh(geometry, material)
      this.object.add(this.meshes[group.id])
    }

    this.meshes[group.id].scale.x = hull.radius + (group.padding || 10)
    this.meshes[group.id].scale.y = hull.radius + (group.padding || 10)
    this.meshes[group.id].position.x = hull.center.x
    this.meshes[group.id].position.y = hull.center.y
  }
}
