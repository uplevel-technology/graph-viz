import {DisplayNode} from './Nodes'
import * as THREE from 'three'
import {MeshBasicMaterial} from 'three'
import {
  get2DConvexHull,
  getCapsulePolygon,
  getCircularHull,
  getRoundedOffsetPolygon,
} from './hullGeometryUtils'

export interface GroupStyleAttributes {
  /**
   * boolean to toggle the visibility of a display group on or off
   */
  visible?: boolean

  /**
   * type of polygon to draw
   * default is convexHull
   */
  shape?: 'convexHull' | 'circle'

  /**
   * fill color hex string
   * (default is #000000)
   */
  fill?: string

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

export interface DisplayGroup extends GroupStyleAttributes {
  id: string
}

export const GROUP_DEFAULTS: Required<GroupStyleAttributes> = {
  shape: 'convexHull',
  visible: false,
  fill: '#000000',
  fillOpacity: 0.09,
  padding: 0,
}

export class DisplayGroups {
  public object = new THREE.Group()
  private meshes: {[groupId: string]: THREE.Mesh} = {}
  private defaults: Required<GroupStyleAttributes> = GROUP_DEFAULTS

  constructor(nodes: DisplayNode[], groups: DisplayGroup[]) {
    this.updateAll(nodes, groups)
  }

  /**
   * update defaults
   * @param newDefaults
   * @param nodes
   * @param groups
   */
  public updateDefaults(
    newDefaults: GroupStyleAttributes,
    nodes: DisplayNode[],
    groups: DisplayGroup[],
  ) {
    this.defaults = {
      ...this.defaults,
      ...newDefaults,
    }
    this.updateAll(nodes, groups)
  }

  /**
   * update all attributes and recompute everything to be sent to gpu
   * @param nodes
   * @param groups
   */
  public updateAll(nodes: DisplayNode[], groups: DisplayGroup[]) {
    const nodesByGroup = this.getGroupedNodes(nodes)

    const visibleGroups = groups.filter(g => g.visible)

    for (const group of visibleGroups) {
      const nodesInGroup = nodesByGroup[group.id]
      if (!nodesInGroup || nodesInGroup.length < 2) {
        continue
      }

      if (group.shape === 'circle') {
        this.renderCircle(group, nodesInGroup)
      } else {
        this.renderConvexHull(group, nodesInGroup)
      }
    }

    const invisibleGroups = groups.filter(g => !g.visible)

    // remove invisible groups that were previously visible
    for (const group of invisibleGroups) {
      if (this.meshes[group.id] !== undefined) {
        this.object.remove(this.meshes[group.id])
        delete this.meshes[group.id]
      }
    }
  }

  public getGroupedNodes(
    nodes: DisplayNode[],
  ): {[groupId: string]: DisplayNode[]} {
    const nodesByGroup: {[groupId: string]: DisplayNode[]} = {}
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

  private renderConvexHull(group: DisplayGroup, nodesInGroup: DisplayNode[]) {
    const convexHull = get2DConvexHull(nodesInGroup) as DisplayNode[]

    const vertices =
      nodesInGroup.length === 2
        ? // a capsule polygon is an offset polygon convex hull for 2 nodes
          getCapsulePolygon(
            nodesInGroup[0],
            nodesInGroup[1],
            group.padding ?? this.defaults.padding,
          )
        : getRoundedOffsetPolygon(
            convexHull,
            group.padding ?? this.defaults.padding,
          )

    let geometry

    // add new display group
    if (this.meshes[group.id] === undefined) {
      // NOTE: we probably don't need a BufferGeometry after r102 amirite?
      geometry = new THREE.Geometry()
      const material = new MeshBasicMaterial({
        color: group.fill ?? this.defaults.fill,
        opacity: group.fillOpacity ?? this.defaults.fillOpacity,
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

  private renderCircle(group: DisplayGroup, nodesInGroup: DisplayNode[]) {
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
        color: group.fill ?? this.defaults.fill,
        opacity: group.fillOpacity ?? this.defaults.fillOpacity,
        transparent: true,
      })
      this.meshes[group.id] = new THREE.Mesh(geometry, material)
      this.object.add(this.meshes[group.id])
    }

    this.meshes[group.id].scale.x = hull.radius + (group.padding ?? 10)
    this.meshes[group.id].scale.y = hull.radius + (group.padding ?? 10)
    this.meshes[group.id].position.x = hull.center.x
    this.meshes[group.id].position.y = hull.center.y
  }
}
