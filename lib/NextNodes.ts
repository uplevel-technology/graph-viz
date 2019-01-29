// @flow

import { defaultTo, size } from 'lodash'
import * as THREE from 'three'
import fragmentShader from './shaders/nodes.fragment.glsl'
import vertexShader from './shaders/nodes.vertex.glsl'

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
   * (default is 0x333333)
   */
  fill?: number | string

  /**
   * The node's container's scale factor (default is 1.0)
   */
  scale?: number

  /**
   * node strike color hex string or hex number
   */
  stroke?: number | string

  /**
   * relative node stroke opacity (must be between 0.0 to 1.0)
   */
  strokeOpacity?: number

  /**
   * relative node stroke width
   * (This width is relative to the node container. Must be between 0.0 to 1.0)
   */
  strokeWidth?: number
}

/**
 * Reusable constants
 */
export const DEFAULT_NODE_FILL = 0x333333
export const DEFAULT_NODE_SCALE = 1.0
export const DEFAULT_NODE_STROKE_WIDTH = 0.03
export const DEFAULT_NODE_STROKE_OPACITY = 1.0
export const LOCKED_NODE_STROKE_WIDTH = 0.3
export const LOCKED_NODE_STROKE_OPACITY = 0.4
export const HOVERED_NODE_SCALE = 1.5

export class NextNodes {
  public object: THREE.Points
  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.ShaderMaterial
  private lockedIds: {[id: string]: boolean} = {}

  constructor(nodes: GraphVizNode[]) {
    const numNodes = size(nodes)
    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3))
    this.geometry.addAttribute('scale', new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1))
    this.geometry.addAttribute('fill', new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3))
    this.geometry.addAttribute('stroke', new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3))
    this.geometry.addAttribute('strokeWidth', new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1))
    this.geometry.addAttribute('strokeOpacity', new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1))

    this.updateAll(nodes)

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

  public handleCameraZoom = (zoom: number) => {
    this.material.uniforms.globalScale.value = zoom < 0.3 ? 0.3 : zoom
    this.material.uniforms.globalScale.value *= window.devicePixelRatio
  }

  public dispose = () => {
    this.geometry.dispose()
    this.material.dispose()
  }

  /**
   * TODO:
   * We should have some sort of mechanism for declaring what fields are dirty on the node
   * and only update them conditionally here.
   */
  /**
   * update all attributes of one node at a given index
   * @param index
   * @param node
   */
  public updateOne = (index: number, node: GraphVizNode) => {
    const position = this.geometry.getAttribute('position') as THREE.BufferAttribute
    const scale = this.geometry.getAttribute('scale') as THREE.BufferAttribute
    const fill = this.geometry.getAttribute('fill') as THREE.BufferAttribute
    const stroke = this.geometry.getAttribute('stroke') as THREE.BufferAttribute
    const strokeWidth = this.geometry.getAttribute('strokeWidth') as THREE.BufferAttribute
    const strokeOpacity = this.geometry.getAttribute('strokeOpacity') as THREE.BufferAttribute


    position.setXYZ(index, node.x, node.y, 0)
    scale.setX(index, defaultTo(node.scale, DEFAULT_NODE_SCALE))

    const color = new THREE.Color()
    color.set(defaultTo(node.fill, DEFAULT_NODE_FILL) as string)
    fill.setXYZ(index, color.r, color.g, color.b)

    if (node.stroke) {
      color.set(node.stroke as string)
    }
    stroke.setXYZ(index, color.r, color.g, color.b)

    strokeWidth.setX(index, defaultTo(node.strokeWidth, DEFAULT_NODE_STROKE_WIDTH))
    strokeOpacity.setX(index, defaultTo(node.strokeOpacity, DEFAULT_NODE_STROKE_OPACITY))


    position.needsUpdate = true
    scale.needsUpdate = true
    fill.needsUpdate = true
    stroke.needsUpdate = true
    strokeWidth.needsUpdate = true
    strokeOpacity.needsUpdate = true

  }

  /**
   * update all attributes of all nodes
   * @param nodes
   */
  public updateAll = (nodes: GraphVizNode[]) => {
    this.updateAllPositions(nodes)
    this.updateAllScales(nodes)
    this.updateAllFills(nodes)
    this.updateAllStrokes(nodes)
    this.updateAllStrokeWidths(nodes)
    this.updateAllStrokeOpacities(nodes)
  }

  /**
   * udpate position attributes of all nodes
   * @param nodes
   */
  public updateAllPositions = (nodes: GraphVizNode[]) => {
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

  /**
   * update scale attributes of all nodes
   * @param nodes
   */
  public updateAllScales = (nodes: GraphVizNode[]) => {
    const scale = this.geometry.getAttribute('scale') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== scale.count) {
      scale.setArray(new Float32Array(scale.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      scale.setX(i, nodes[i].scale || DEFAULT_NODE_SCALE)
    }

    scale.needsUpdate = true
  }

  /**
   * update fill attributes of all nodes
   * @param nodes
   */
  public updateAllFills = (nodes: GraphVizNode[]) => {
    const fill = this.geometry.getAttribute('fill') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== fill.count) {
      fill.setArray(new Float32Array(fill.itemSize * numNodes))
    }

    const tmpColor = new THREE.Color() // for reuse
    for (let i = 0; i < numNodes; i++) {
      tmpColor.set(defaultTo(nodes[i].fill, DEFAULT_NODE_FILL) as string)
      fill.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b)
    }

    fill.needsUpdate = true
  }

  /**
   * update stroke color attributes of all nodes
   * @param nodes
   */
  public updateAllStrokes = (nodes: GraphVizNode[]) => {
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

  /**
   * update stroke width attributes of all nodes
   * @param nodes
   */
  public updateAllStrokeWidths = (nodes: GraphVizNode[]) => {
    const strokeWidth = this.geometry.getAttribute('strokeWidth') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== strokeWidth.count) {
      strokeWidth.setArray(new Float32Array(strokeWidth.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      // preserve stroke widths during data updates for locked nodes
      if (!this.lockedIds[i]) {
        strokeWidth.setX(i, defaultTo(nodes[i].strokeWidth, DEFAULT_NODE_STROKE_WIDTH))
      }
    }

    strokeWidth.needsUpdate = true
  }

  /**
   * update stroke opacity attributes of all nodes
   * @param nodes
   */
  public updateAllStrokeOpacities = (nodes: GraphVizNode[]) => {
    const strokeOpacity = this.geometry.getAttribute('strokeOpacity') as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== strokeOpacity.count) {
      strokeOpacity.setArray(new Float32Array(strokeOpacity.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      if (!this.lockedIds[i]) {
        strokeOpacity.setX(i, defaultTo(nodes[i].strokeOpacity, DEFAULT_NODE_STROKE_OPACITY))
      }
    }

    strokeOpacity.needsUpdate = true
  }
}
