import {GraphVizNode} from './Nodes'
import * as THREE from 'three'
import {MeshBasicMaterial} from 'three'
import {get2DConvexHull, getNiceOffsetPolygon} from './convexHull'

export interface VizDisplayGroup {
  id: string
  /**
   * node fill color hex string or hex number
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

  constructor(nodes: GraphVizNode[], groups: VizDisplayGroup[]) {
    this.updateAll(nodes, groups)
  }

  public updateAll(nodes: GraphVizNode[], groups: VizDisplayGroup[]) {
    const nodesByGroup = this.getGroupedNodes(nodes)

    const renderedGroupIds = new Set()

    for (const group of groups) {
      const nodesInGroup = nodesByGroup[group.id]
      if (!nodesInGroup) {
        continue
      }
      const convexHull = get2DConvexHull(nodesInGroup) as GraphVizNode[]
      const vertices = getNiceOffsetPolygon(convexHull, group.padding)

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

      renderedGroupIds.add(group.id)
    }

    // remove deleted display group
    for (const groupId in this.meshes) {
      if (!renderedGroupIds.has(groupId)) {
        this.object.remove(this.meshes[groupId])
        delete this.meshes[groupId]
      }
    }
  }

  public getGroupedNodes(
    nodes: GraphVizNode[],
  ): {[groupId: string]: GraphVizNode[]} {
    const nodesByGroup: {[groupId: string]: GraphVizNode[]} = {}
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
}
