// @flow

import * as d3 from 'd3'
import {size} from 'lodash'
import * as THREE from 'three'
import {SimLink, SimNode, D3Simulation} from '../ForceSimulation'

const DEFAULT_COLOR = 0xbbbbbb
const HIGHLIGHTED_COLOR = 0x333333

export class Lines {
  public simulation: D3Simulation
  public object: THREE.LineSegments

  private highlightEdges: boolean = false
  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.LineBasicMaterial

  constructor(simulation: D3Simulation) {
    this.simulation = simulation

    const forceLinks = this.simulation.force('links') as d3.ForceLink<SimNode, SimLink>
    const links = forceLinks.links()
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

  public updatePositions = () => {
    const forceLinks = this.simulation.force('links') as d3.ForceLink<SimNode, SimLink>
    const links = forceLinks.links()
    this.recalcPositionFromData(links)
  }

  public redraw = () => {
    const forceLinks = this.simulation.force('links') as d3.ForceLink<SimNode, SimLink>
    const links = forceLinks.links()
    this.recalcPositionFromData(links)
    this.recalcColorFromData(links)
  }

  public dispose = () => {
    this.geometry.dispose()
    this.material.dispose()
  }

  private recalcPositionFromData = (links: Array<SimLink>) => {
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

  private recalcColorFromData = (links: Array<SimLink>) => {
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
