// @flow

import {defaultTo, size} from 'lodash'
import * as THREE from 'three'
import fragmentShader from './shaders/nodes.fragment.glsl'
import vertexShader from './shaders/nodes.vertex.glsl'

export const DEFAULT_NODE_SIZE = 20.0

export interface GraphVizNode {
  /**
   * Unique node id
   */
  id: string

  /**
   * x coordinate of the node position
   */
  x: number

  /**
   * y position of the node position
   */
  y: number

  /**
   * inactive is a boolean that makes a node grey when set.
   * @DEPRECATED
   */
  inactive?: boolean

  /**
   * node fill color hex string or hex number
   */
  fill?: number | string

  /**
   * The node container's absolute size in pixels at the default zoom level
   * TODO: This is a bad name. We need to make more sense of this by ensuring all visual attributes
   * can be translated represented by a property name in GraphVizNode. e.g. scale.
   */
  size?: number

  /**
   * node strike color hex string or hex number
   */
  stroke?: number | string

  /**
   * relative node stroke opacity (must be between 0.0 to 1.0)
   */
  strokeOpacity?: number

  /**
   * relative node stroke width (must be between 0.0 to 1.0)
   */
  strokeWidth?: number
}

export class NextNodes {
  public object: THREE.Points
  private nodes: GraphVizNode[]
  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.ShaderMaterial
  private lockedIds: {[id: string]: boolean} = {}

  constructor(nodes: GraphVizNode[]) {
    this.nodes = nodes
    const numNodes = size(nodes)
    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3))
    this.geometry.addAttribute('size', new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1))
    this.geometry.addAttribute('scale', new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1))
    this.geometry.addAttribute('fill', new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3))
    this.geometry.addAttribute('stroke', new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3))
    this.geometry.addAttribute('strokeWidth', new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1))
    this.geometry.addAttribute('strokeOpacity', new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1))

    this.recalcAttributesFromData(nodes)

    this.material = new THREE.ShaderMaterial({
      fragmentShader,
      transparent: true,
      uniforms: {
        globalScale: {value: window.devicePixelRatio},
        defaultColor: {value: new THREE.Color(0xffffff)},
      },
      vertexShader,
    })

    this.object = new THREE.Points(this.geometry, this.material)
  }

  public updatePositions = (nodes: GraphVizNode[]) => {
    this.nodes = nodes
    this.recalcPositionFromData(this.nodes)
  }

  public handleCameraZoom = (zoom: number) => {
    this.material.uniforms.globalScale.value = zoom < 0.3 ? 0.3 : zoom
    this.material.uniforms.globalScale.value *= window.devicePixelRatio
  }

  public redraw = (nodes: GraphVizNode[]) => {
    this.nodes = nodes
    this.recalcAttributesFromData(this.nodes)
  }

  public dispose = () => {
    this.geometry.dispose()
    this.material.dispose()
  }

  private recalcAttributesFromData = (nodes: GraphVizNode[]) => {
    this.recalcPositionFromData(nodes)
    this.recalcSizeFromData(nodes)
    this.recalcScaleFromData(nodes)
    this.recalcFillFromData(nodes)
    this.recalcStrokeFromData(nodes)
    this.recalcStrokeWidthFromData(nodes)
    this.recalcStrokeOpacityFromData(nodes)
  }

  private recalcPositionFromData = (nodes: GraphVizNode[]) => {
    const position = this.geometry.getAttribute('position') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== position.count) {
      position.setArray(new Float32Array(position.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      position.setXYZ(i, nodes[i].x!, nodes[i].y!, 0)
    }

    position.needsUpdate = true

    this.geometry.computeBoundingSphere()
  }

  private recalcSizeFromData = (nodes: GraphVizNode[]) => {
    const nodeSize = this.geometry.getAttribute('size') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== nodeSize.count) {
      nodeSize.setArray(new Float32Array(nodeSize.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      nodeSize.setX(i, nodes[i].size || DEFAULT_NODE_SIZE)
    }

    nodeSize.needsUpdate = true
  }

  private recalcScaleFromData = (nodes: GraphVizNode[]) => {
    const scale = this.geometry.getAttribute('scale') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== scale.count) {
      scale.setArray(new Float32Array(scale.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      scale.setX(i, 1)
    }

    scale.needsUpdate = true
  }

  private recalcFillFromData = (nodes: GraphVizNode[]) => {
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

  private recalcStrokeFromData = (nodes: GraphVizNode[]) => {
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

  private recalcStrokeWidthFromData = (nodes: GraphVizNode[]) => {
    const strokeWidth = this.geometry.getAttribute('strokeWidth') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== strokeWidth.count) {
      strokeWidth.setArray(new Float32Array(strokeWidth.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      // preserve stroke widths during data updates for locked nodes
      if (!this.lockedIds[i]) {
        strokeWidth.setX(i, nodes[i].strokeWidth!)
      }
    }

    strokeWidth.needsUpdate = true
  }

  private recalcStrokeOpacityFromData = (nodes: GraphVizNode[]) => {
    const strokeOpacity = this.geometry.getAttribute('strokeOpacity') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== strokeOpacity.count) {
      strokeOpacity.setArray(new Float32Array(strokeOpacity.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      if (!this.lockedIds[i]) {
        strokeOpacity.setX(i, nodes[i].strokeOpacity!)
      }
    }

    strokeOpacity.needsUpdate = true
  }
}
