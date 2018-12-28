// @flow

import {size} from 'lodash'
import * as THREE from 'three'
import {VisualGraphLink} from './GraphVisualization'

const DEFAULT_COLOR = 0xbbbbbb
const HIGHLIGHTED_COLOR = 0x333333

export class Links {
  public object: THREE.LineSegments

  private highlightEdges: boolean = false
  private links: VisualGraphLink[]
  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.LineBasicMaterial

  constructor(links: VisualGraphLink[]) {
    this.links = links
    const numLinks = size(links)

    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numLinks * 2 * 3), 3))
    this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numLinks * 2 * 3), 3))
    this.recalcPositionFromData(links)
    this.recalcColorFromData(links)

    this.material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors})

    this.object = new THREE.LineSegments(this.geometry, this.material)
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

    if (numLinks * 2 !== position.count) {
      position.setArray(new Float32Array(position.itemSize * numLinks * 2))
    }

    for (let i = 0; i < numLinks; i++) {
      const sourceIndex = 2 * i
      const targetIndex = 2 * i + 1

      position.setXYZ(sourceIndex, links[i].source.x!, links[i].source.y!, 0)
      position.setXYZ(targetIndex, links[i].target.x!, links[i].target.y!, 0)
    }

    position.needsUpdate = true

    this.geometry.computeBoundingSphere()
  }

  private recalcColorFromData = (links: VisualGraphLink[]) => {
    const color = this.geometry.getAttribute('color') as THREE.BufferAttribute

    const numLinks = size(links)

    if (numLinks * 2 !== color.count) {
      color.setArray(new Float32Array(color.itemSize * numLinks * 2))
    }

    const tmpColor = new THREE.Color() // for reuse

    for (let i = 0; i < numLinks; i++) {
      const sourceIndex = 2 * i
      const targetIndex = 2 * i + 1

      if (this.highlightEdges && !links[i].source.inactive && !links[i].target.inactive) {
        tmpColor.set(HIGHLIGHTED_COLOR)
      } else {
        tmpColor.set(DEFAULT_COLOR)
      }

      color.setXYZ(sourceIndex, tmpColor.r, tmpColor.g, tmpColor.b)
      color.setXYZ(targetIndex, tmpColor.r, tmpColor.g, tmpColor.b)
    }

    color.needsUpdate = true
  }
}
