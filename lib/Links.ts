// @flow

import {size} from 'lodash'
import * as THREE from 'three'
import {VisualGraphLink} from './GraphVisualization'

const VERTICES_PER_QUAD = 6 // quads require 6 vertices (2 repeated)
const QUAD_WIDTH = 10

const DEFAULT_COLOR = 0xbbbbbb
const HIGHLIGHTED_COLOR = 0x333333

export class Links {
  public object: THREE.Mesh

  private highlightEdges: boolean = false
  private links: VisualGraphLink[]
  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.MeshBasicMaterial

  constructor(links: VisualGraphLink[]) {
    this.links = links
    const numLinks = size(links)
    const numVertices = numLinks * VERTICES_PER_QUAD

    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numVertices * 3), 3))
    this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numVertices * 3), 3))
    this.recalcPositionFromData(links)
    this.recalcColorFromData(links)

    this.material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors})

    this.object = new THREE.Mesh(this.geometry, this.material)
    this.object.name = 'lines'
  }

  public enableEdgeHighlight = () => {
    this.highlightEdges = true
  }

  public disableEdgeHighlight = () => {
    this.highlightEdges = false
  }

  public updatePositions = (links: VisualGraphLink[]) => {
    this.links = links
    this.recalcPositionFromData(this.links)
  }

  public redraw = (links: VisualGraphLink[]) => {
    this.links = links
    this.recalcPositionFromData(this.links)
    this.recalcColorFromData(this.links)
  }

  public dispose = () => {
    this.geometry.dispose()
    this.material.dispose()
  }

  private recalcPositionFromData = (links: VisualGraphLink[]) => {
    const position = this.geometry.getAttribute('position') as THREE.BufferAttribute
    const numLinks = size(links)
    const numVertices = numLinks * VERTICES_PER_QUAD

    if (numVertices !== position.count) {
      position.setArray(new Float32Array(numVertices * position.itemSize))
    }

    const source = new THREE.Vector2()
    const target = new THREE.Vector2()

    for (let i = 0; i < numLinks; i++) {
      source.set(links[i].source.x!, links[i].source.y!)
      target.set(links[i].target.x!, links[i].target.y!)

      const normal = target.clone().sub(source).normalize() // now a unit vector tangent to the link
      normal.set(-normal.y, normal.x) // rotate 90 degrees to make it normal to the link
      normal.multiplyScalar(QUAD_WIDTH / 2)

      // The four corners of the quad:
      const a = source.clone().add(normal)
      const b = source.clone().sub(normal)
      const c = target.clone().add(normal)
      const d = target.clone().sub(normal)

      // First triangle:
      position.setXYZ(i * VERTICES_PER_QUAD + 0, a.x, a.y, 0)
      position.setXYZ(i * VERTICES_PER_QUAD + 1, b.x, b.y, 0)
      position.setXYZ(i * VERTICES_PER_QUAD + 2, c.x, c.y, 0)

      // Second triangle, repeating two of the vertices in the first triangle:
      position.setXYZ(i * VERTICES_PER_QUAD + 3, d.x, d.y, 0)
      position.setXYZ(i * VERTICES_PER_QUAD + 4, c.x, c.y, 0)
      position.setXYZ(i * VERTICES_PER_QUAD + 5, b.x, b.y, 0)
    }

    position.needsUpdate = true

    this.geometry.computeBoundingSphere()
  }

  private recalcColorFromData = (links: VisualGraphLink[]) => {
    const color = this.geometry.getAttribute('color') as THREE.BufferAttribute

    const numLinks = size(links)
    const numVertices = numLinks * VERTICES_PER_QUAD

    if (numVertices !== color.count) {
      color.setArray(new Float32Array(numVertices * color.itemSize))
    }

    const tmpColor = new THREE.Color() // for reuse

    for (let i = 0; i < numLinks; i++) {
      if (this.highlightEdges && !links[i].source.inactive && !links[i].target.inactive) {
        tmpColor.set(HIGHLIGHTED_COLOR)
      } else {
        tmpColor.set(DEFAULT_COLOR)
      }

      // Repeat for all vertices of this quad:
      for (let vertexIndex = i * VERTICES_PER_QUAD; vertexIndex < (i + 1) * VERTICES_PER_QUAD; vertexIndex++) {
        color.setXYZ(vertexIndex, tmpColor.r, tmpColor.g, tmpColor.b)
      }
    }

    color.needsUpdate = true
  }
}
