// @flow

import {defaultTo, size} from 'lodash'
import * as THREE from 'three'
import {nodesFragmentShader, nodesVertexShader} from './shaders/asText'

export interface DisplayNode {
  /**
   * Unique node id
   */
  id: string

  /**
   * optional display group IDs
   */
  displayGroupIds?: string[]

  /**
   * x coordinate of the node position
   */
  x: number

  /**
   * y position of the node position
   */
  y: number

  /**
   * node fill color hex string
   * (default is #333333)
   */
  fill?: string

  /**
   * relative node fill opacity
   * (must be between 0.0 - 1.0)
   */
  fillOpacity?: number

  /**
   * the absolute side in pixels of the bounding square container of the node
   * (default is 20 pixels)
   */
  absoluteSize?: number

  /**
   * node container's scale factor
   * (default is 1.0)
   */
  scale?: number

  /**
   * inner radius of the node circle relative to the absolute container size
   * (must be between 0.0 to 1.0). (default is 0.2)
   */
  innerRadius?: number

  /**
   * node strike color hex string
   */
  stroke?: string

  /**
   * relative node stroke opacity
   * (must be between 0.0 - 1.0)
   */
  strokeOpacity?: number

  /**
   * relative node stroke width
   * (This width is relative to the node container. Must be between 0.0 to 1.0)
   */
  strokeWidth?: number

  /**
   * disables interactions on this node if set
   * (default is false)
   * NOTE: this could be defined on a mouse interaction node interface
   */
  disableInteractions?: boolean
}

/**
 * Constants
 */
export const DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE = 20
export const DEFAULT_NODE_INNER_RADIUS = 0.2
export const DEFAULT_NODE_FILL = '#333333'
export const DEFAULT_NODE_FILL_OPACITY = 1.0
export const DEFAULT_NODE_SCALE = 1.0
export const DEFAULT_NODE_STROKE_WIDTH = 0.03
export const DEFAULT_NODE_STROKE_OPACITY = 1.0
export const LOCKED_NODE_STROKE_WIDTH = 0.3
export const LOCKED_NODE_STROKE_OPACITY = 0.4
export const HOVERED_NODE_SCALE = 1.5

export class Nodes {
  public object: THREE.Points

  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.ShaderMaterial
  private lockedIds: {[id: string]: boolean} = {}

  constructor(nodes: DisplayNode[]) {
    const numNodes = size(nodes)
    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3),
    )
    this.geometry.addAttribute(
      'absoluteSize',
      new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1),
    )
    this.geometry.addAttribute(
      'scale',
      new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1),
    )
    this.geometry.addAttribute(
      'innerRadius',
      new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1),
    )
    this.geometry.addAttribute(
      'fill',
      new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3),
    )
    this.geometry.addAttribute(
      'fillOpacity',
      new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1),
    )
    this.geometry.addAttribute(
      'stroke',
      new THREE.BufferAttribute(new Float32Array(numNodes * 3), 3),
    )
    this.geometry.addAttribute(
      'strokeWidth',
      new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1),
    )
    this.geometry.addAttribute(
      'strokeOpacity',
      new THREE.BufferAttribute(new Float32Array(numNodes * 1), 1),
    )

    this.updateAll(nodes)

    this.material = new THREE.ShaderMaterial({
      fragmentShader: nodesFragmentShader,
      transparent: true,
      uniforms: {
        globalScale: {value: window.devicePixelRatio},
      },
      vertexShader: nodesVertexShader,
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
  public updateOne = (index: number, node: DisplayNode) => {
    const position = this.geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute
    const absoluteSize = this.geometry.getAttribute(
      'absoluteSize',
    ) as THREE.BufferAttribute
    const scale = this.geometry.getAttribute('scale') as THREE.BufferAttribute
    const innerRadius = this.geometry.getAttribute(
      'innerRadius',
    ) as THREE.BufferAttribute
    const fill = this.geometry.getAttribute('fill') as THREE.BufferAttribute
    const fillOpacity = this.geometry.getAttribute(
      'fillOpacity',
    ) as THREE.BufferAttribute
    const stroke = this.geometry.getAttribute('stroke') as THREE.BufferAttribute
    const strokeWidth = this.geometry.getAttribute(
      'strokeWidth',
    ) as THREE.BufferAttribute
    const strokeOpacity = this.geometry.getAttribute(
      'strokeOpacity',
    ) as THREE.BufferAttribute

    position.setXYZ(index, node.x, node.y, 0)
    position.needsUpdate = true

    absoluteSize.setX(
      index,
      defaultTo(node.absoluteSize, DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE),
    )
    absoluteSize.needsUpdate = true

    scale.setX(index, defaultTo(node.scale, DEFAULT_NODE_SCALE))
    scale.needsUpdate = true

    innerRadius.setX(
      index,
      defaultTo(node.innerRadius, DEFAULT_NODE_INNER_RADIUS),
    )
    innerRadius.needsUpdate = true

    const color = new THREE.Color()
    color.set(defaultTo(node.fill, DEFAULT_NODE_FILL) as string)
    fill.setXYZ(index, color.r, color.g, color.b)
    fill.needsUpdate = true

    fillOpacity.setX(
      index,
      defaultTo(node.fillOpacity, DEFAULT_NODE_FILL_OPACITY),
    )

    if (node.stroke) {
      color.set(node.stroke as string)
    }
    stroke.setXYZ(index, color.r, color.g, color.b)
    stroke.needsUpdate = true

    strokeWidth.setX(
      index,
      defaultTo(node.strokeWidth, DEFAULT_NODE_STROKE_WIDTH),
    )
    strokeWidth.needsUpdate = true

    strokeOpacity.setX(
      index,
      defaultTo(node.strokeOpacity, DEFAULT_NODE_STROKE_OPACITY),
    )
    strokeOpacity.needsUpdate = true
  }

  /**
   * update all attributes of all nodes
   * @param nodes
   */
  public updateAll = (nodes: DisplayNode[]) => {
    this.updateAllPositions(nodes)
    this.updateAllAbsoluteSizes(nodes)
    this.updateAllScales(nodes)
    this.updateAllInnerRadii(nodes)
    this.updateAllFills(nodes)
    this.updateAllStrokes(nodes)
    this.updateAllStrokeWidths(nodes)
    this.updateAllStrokeOpacities(nodes)
  }

  /**
   * udpate position attributes of all nodes
   * @param nodes
   */
  public updateAllPositions = (nodes: DisplayNode[]) => {
    const position = this.geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute

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
   * update absoluteSize attributes of all nodes
   * @param nodes
   */
  public updateAllAbsoluteSizes = (nodes: DisplayNode[]) => {
    const absoluteSize = this.geometry.getAttribute(
      'absoluteSize',
    ) as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== absoluteSize.count) {
      absoluteSize.setArray(new Float32Array(absoluteSize.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      absoluteSize.setX(
        i,
        nodes[i].absoluteSize || DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE,
      )
    }

    absoluteSize.needsUpdate = true
  }

  /**
   * update scale attributes of all nodes
   * @param nodes
   */
  public updateAllScales = (nodes: DisplayNode[]) => {
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
   * update innerRadius attributes of all nodes
   * @param nodes
   */
  public updateAllInnerRadii = (nodes: DisplayNode[]) => {
    const innerRadius = this.geometry.getAttribute(
      'innerRadius',
    ) as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== innerRadius.count) {
      innerRadius.setArray(new Float32Array(innerRadius.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      innerRadius.setX(i, nodes[i].innerRadius || DEFAULT_NODE_INNER_RADIUS)
    }

    innerRadius.needsUpdate = true
  }

  /**
   * update fill and fillOpacity attributes of all nodes
   * @param nodes
   */
  public updateAllFills = (nodes: DisplayNode[]) => {
    const fill = this.geometry.getAttribute('fill') as THREE.BufferAttribute
    const fillOpacity = this.geometry.getAttribute(
      'fillOpacity',
    ) as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== fill.count) {
      fill.setArray(new Float32Array(fill.itemSize * numNodes))
      fillOpacity.setArray(new Float32Array(fillOpacity.itemSize * numNodes))
    }

    const tmpColor = new THREE.Color() // for reuse
    for (let i = 0; i < numNodes; i++) {
      tmpColor.set(defaultTo(nodes[i].fill, DEFAULT_NODE_FILL) as string)
      fill.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b)
      fillOpacity.setX(
        i,
        defaultTo(nodes[i].fillOpacity, DEFAULT_NODE_FILL_OPACITY),
      )
    }

    fill.needsUpdate = true
    fillOpacity.needsUpdate = true
  }

  /**
   * update stroke color attributes of all nodes
   * @param nodes
   */
  public updateAllStrokes = (nodes: DisplayNode[]) => {
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
  public updateAllStrokeWidths = (nodes: DisplayNode[]) => {
    const strokeWidth = this.geometry.getAttribute(
      'strokeWidth',
    ) as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== strokeWidth.count) {
      strokeWidth.setArray(new Float32Array(strokeWidth.itemSize * numNodes))
    }

    for (let i = 0; i < numNodes; i++) {
      // preserve stroke widths during data updates for locked nodes
      if (!this.lockedIds[i]) {
        strokeWidth.setX(
          i,
          defaultTo(nodes[i].strokeWidth, DEFAULT_NODE_STROKE_WIDTH),
        )
      }
    }

    strokeWidth.needsUpdate = true
  }

  /**
   * update stroke opacity attributes of all nodes
   * @param nodes
   */
  public updateAllStrokeOpacities = (nodes: DisplayNode[]) => {
    const strokeOpacity = this.geometry.getAttribute(
      'strokeOpacity',
    ) as THREE.BufferAttribute

    const numNodes = size(nodes)
    if (numNodes !== strokeOpacity.count) {
      strokeOpacity.setArray(
        new Float32Array(strokeOpacity.itemSize * numNodes),
      )
    }

    for (let i = 0; i < numNodes; i++) {
      if (!this.lockedIds[i]) {
        strokeOpacity.setX(
          i,
          defaultTo(nodes[i].strokeOpacity, DEFAULT_NODE_STROKE_OPACITY),
        )
      }
    }

    strokeOpacity.needsUpdate = true
  }
}
