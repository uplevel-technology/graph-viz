// @flow

import {defaultTo, get, size} from 'lodash-es'
import * as THREE from 'three'
import {SimNode, Simulation} from './GraphVisualization'
import fragmentShader from './shaders/nodes.fragment.glsl'
import vertexShader from './shaders/nodes.vertex.glsl'

export class Nodes {
  public object: THREE.Points
  public simulation: Simulation
  private readonly geometry: THREE.BufferGeometry
  private readonly camera: THREE.OrthographicCamera
  private readonly material: THREE.ShaderMaterial
  private lockedIds: {[id: string]: boolean} = {}

  constructor(simulation: Simulation, camera: THREE.OrthographicCamera) {
    this.simulation = simulation
    this.camera = camera

    const numNodes = size(simulation.nodes())
    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3))
    this.geometry.addAttribute('scale', new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1))
    this.geometry.addAttribute('fill', new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3))
    this.geometry.addAttribute('stroke', new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3))
    this.geometry.addAttribute('strokeWidth', new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1))
    this.geometry.addAttribute('strokeOpacity', new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1))

    this.recalcAttributesFromData(simulation.nodes())

    this.material = new THREE.ShaderMaterial({
      fragmentShader,
      transparent: true,
      uniforms: {
        cameraZoom: {value: this.camera.zoom},
        defaultColor: {value: new THREE.Color(0xffffff)},
      },
      vertexShader,
    })

    this.object = new THREE.Points(this.geometry, this.material)
  }

  public updatePositions = () => {
    this.recalcPositionFromData(this.simulation.nodes())
  }

  public handleCameraZoom = () => {
    this.material.uniforms.cameraZoom.value = this.camera.zoom < 0.3 ? 0.3 : this.camera.zoom
    this.material.needsUpdate = true
  }

  public scalePointAt = (pointIdx: number, scale: number = 1.0) => {
    const scaleAttr = this.geometry.getAttribute('scale') as THREE.BufferAttribute
    if (scaleAttr.array) {
      scaleAttr.setX(pointIdx, window.devicePixelRatio * scale)
      scaleAttr.needsUpdate = true
    }
  }

  public lockPointAt = (pointIdx: number) => {
    this.updateAttributeAt('strokeWidth', pointIdx, 0.3)
    this.updateAttributeAt('strokeOpacity', pointIdx, 0.4)
    this.lockedIds[pointIdx] = true
  }

  public unlockPointAt = (pointIdx: number) => {
    this.resetAttributeAt('strokeWidth', pointIdx)
    this.resetAttributeAt('strokeOpacity', pointIdx)
    this.lockedIds[pointIdx] = false
  }

  public redraw = () => {
    this.recalcAttributesFromData(this.simulation.nodes())
  }

  public dispose = () => {
    this.geometry.dispose()
    this.material.dispose()
  }

  private recalcAttributesFromData = (nodes: Array<SimNode>) => {
    this.recalcPositionFromData(nodes)
    this.recalcScaleFromData(nodes)
    this.recalcFillFromData(nodes)
    this.recalcStrokeFromData(nodes)
    this.recalcStrokeWidthFromData(nodes)
    this.recalcStrokeOpacityFromData(nodes)
  }

  private recalcPositionFromData = (nodes: Array<SimNode>) => {
    const position = this.geometry.getAttribute('position') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== position.count) {
      position.setArray(new Float32Array(position.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      position.setXYZ(i, nodes[i].x, nodes[i].y, 0)
    }

    position.needsUpdate = true

    // Recompute bounding sphere as needed
    this.geometry.boundingSphere = null
  }

  private recalcScaleFromData = (nodes: Array<SimNode>) => {
    const scale = this.geometry.getAttribute('scale') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== scale.count) {
      scale.setArray(new Float32Array(scale.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      scale.setX(i, window.devicePixelRatio)
    }

    scale.needsUpdate = true
  }

  private recalcFillFromData = (nodes: Array<SimNode>) => {
    const fill = this.geometry.getAttribute('fill') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== fill.count) {
      fill.setArray(new Float32Array(fill.itemSize * numNodes))
    }

    const tmpColor = new THREE.Color() // for reuse
    for (let i = 0; i < numNodes; i++) {
      tmpColor.set(defaultTo(nodes[i].fill, 0x333333) as string)
      fill.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b)
    }

    fill.needsUpdate = true
  }

  private recalcStrokeFromData = (nodes: Array<SimNode>) => {
    const stroke = this.geometry.getAttribute('stroke') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== stroke.count) {
      stroke.setArray(new Float32Array(stroke.itemSize * numNodes))
    }

    const tmpColor = new THREE.Color() // for reuse
    for (let i = 0; i < numNodes; i++) {
      tmpColor.set(defaultTo(nodes[i].stroke, nodes[i].fill) as string)
      stroke.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b)
    }

    stroke.needsUpdate = true
  }

  private recalcStrokeWidthFromData = (nodes: Array<SimNode>) => {
    const strokeWidth = this.geometry.getAttribute('strokeWidth') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== strokeWidth.count) {
      strokeWidth.setArray(new Float32Array(strokeWidth.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      // preserve stroke widths during data updates for locked nodes
      if (!this.lockedIds[i]) {
        strokeWidth.setX(i, nodes[i].strokeWidth)
      }
    }

    strokeWidth.needsUpdate = true
  }

  private recalcStrokeOpacityFromData = (nodes: Array<SimNode>) => {
    const strokeOpacity = this.geometry.getAttribute('strokeOpacity') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== strokeOpacity.count) {
      strokeOpacity.setArray(new Float32Array(strokeOpacity.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      if (!this.lockedIds[i]) {
        strokeOpacity.setX(i, nodes[i].strokeOpacity)
      }
    }

    strokeOpacity.needsUpdate = true
  }

  private updateAttributeAt = (attributeName: string, pointIdx: number, value: number) => {
    const attr = this.geometry.getAttribute(attributeName) as THREE.BufferAttribute
    if (attr.array) {
      attr.setX(pointIdx, value)
      attr.needsUpdate = true
    }
  }

  private resetAttributeAt = (attributeName: string, pointIdx: number) => {
    const attr = this.geometry.getAttribute(attributeName) as THREE.BufferAttribute
    if (attr.array) {
      const initialNodeState = get(this.simulation.nodes(), pointIdx)
      attr.setX(pointIdx, get(initialNodeState, attributeName))
      attr.needsUpdate = true
    }
  }
}
