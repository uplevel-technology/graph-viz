// @flow

import {defaultTo, size, defaults} from 'lodash'
import * as THREE from 'three'
import {nodesFragmentShader, nodesVertexShader} from './shaders/asText'
import {BufferAttribute} from 'three'

export interface NodeStyleAttributes {
  /**
   * node fill color hex string
   * @default "#333333"
   */
  fill?: string

  /**
   * relative node fill opacity
   * @default 1
   * @minimum 0
   * @maximum 1
   */
  fillOpacity?: number

  /**
   * the absolute side in pixels of the bounding square container of the node
   * @default 20
   * @minimum 0
   */
  absoluteSize?: number

  /**
   * node container's scale factor
   * @default 1
   * @minimum 0
   * @maximum 1
   */
  scale?: number

  /**
   * inner radius of the node circle relative to the absolute container size
   * (default is 0.2 or 20% of the absolute size)
   * @default 0.2
   * @minimum 0
   * @maximum 1
   */
  innerRadius?: number

  /**
   * node strike color hex string
   * @default "#333333"
   */
  stroke?: string

  /**
   * relative node stroke opacity.
   * @default 1
   * @minimum 0
   * @maximum 1
   */
  strokeOpacity?: number

  /**
   * node stroke width relative to node container.
   * @default 0
   */
  strokeWidth?: number
}

export interface DisplayNode extends NodeStyleAttributes {
  /**
   * unique node id
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

  // NOTE: this could be defined on a mouse interaction node interface
  /**
   * disables interactions on this node if set
   * @default false
   */
  disableInteractions?: boolean
}

export const NODE_DEFAULTS = {
  absoluteSize: 20,
  innerRadius: 0.2,
  fill: '#333333',
  fillOpacity: 1.0,
  scale: 1.0,
  stroke: '#333333',
  strokeWidth: 0,
  strokeOpacity: 1.0,
}

export class Nodes {
  public object: THREE.Points

  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.ShaderMaterial
  private lockedIds: {[id: string]: boolean} = {}
  private defaults: Required<NodeStyleAttributes> = NODE_DEFAULTS

  constructor(nodes: DisplayNode[]) {
    const numNodes = size(nodes)
    this.geometry = new THREE.BufferGeometry()
    this.initPositionIfNeeded(numNodes)
    this.initAbsoluteSizeIfNeeded(numNodes)
    this.initScaleIfNeeded(numNodes)
    this.initInnerRadiusIfNeeded(numNodes)
    this.initFillIfNeeded(numNodes)
    this.initFillOpacityIfNeeded(numNodes)
    this.initStrokeIfNeeded(numNodes)
    this.initStrokeWidthIfNeeded(numNodes)
    this.initStrokeOpacityIfNeeded(numNodes)

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

  /**
   * initAttrIfNeeded
   * initializes the attribute if the attribute is undefined OR if the
   * attribute.count needs to be resized
   * @param numVertices
   */
  private initPositionIfNeeded(numVertices: number) {
    const attrName = 'position'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices * 3), 3),
      )
    }
  }

  private initAbsoluteSizeIfNeeded(numVertices: number) {
    const attrName = 'absoluteSize'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
      )
    }
  }

  private initScaleIfNeeded(numVertices: number) {
    const attrName = 'scale'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
      )
    }
  }

  private initInnerRadiusIfNeeded(numVertices: number) {
    const attrName = 'innerRadius'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
      )
    }
  }

  private initFillIfNeeded(numVertices: number) {
    const attrName = 'fill'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices * 3), 3),
      )
    }
  }

  private initFillOpacityIfNeeded(numVertices: number) {
    const attrName = 'fillOpacity'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
      )
    }
  }

  private initStrokeIfNeeded(numVertices: number) {
    const attrName = 'stroke'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices * 3), 3),
      )
    }
  }

  private initStrokeWidthIfNeeded(numVertices: number) {
    const attrName = 'strokeWidth'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
      )
    }
  }

  private initStrokeOpacityIfNeeded(numVertices: number) {
    const attrName = 'strokeOpacity'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
      )
    }
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
      defaultTo(node.absoluteSize, this.defaults.absoluteSize),
    )
    absoluteSize.needsUpdate = true

    scale.setX(index, defaultTo(node.scale, this.defaults.scale))
    scale.needsUpdate = true

    innerRadius.setX(
      index,
      defaultTo(node.innerRadius, this.defaults.innerRadius),
    )
    innerRadius.needsUpdate = true

    const color = new THREE.Color()
    color.set(defaultTo(node.fill, this.defaults.fill) as string)
    fill.setXYZ(index, color.r, color.g, color.b)
    fill.needsUpdate = true

    fillOpacity.setX(
      index,
      defaultTo(node.fillOpacity, this.defaults.fillOpacity),
    )

    if (node.stroke) {
      color.set(node.stroke as string)
    }
    stroke.setXYZ(index, color.r, color.g, color.b)
    stroke.needsUpdate = true

    strokeWidth.setX(
      index,
      defaultTo(node.strokeWidth, this.defaults.strokeWidth),
    )
    strokeWidth.needsUpdate = true

    strokeOpacity.setX(
      index,
      defaultTo(node.strokeOpacity, this.defaults.strokeOpacity),
    )
    strokeOpacity.needsUpdate = true
  }

  /**
   * update the default style values applied to all nodes
   * undefined values reset to default
   * @param newDefaults
   * @param nodes
   */
  public updateDefaults(
    newDefaults: NodeStyleAttributes | undefined,
    nodes: DisplayNode[],
  ) {
    // merge with NODE_DEFAULTS so undefined values are reset to default values
    const mergedDefaults = defaults({}, newDefaults, NODE_DEFAULTS)

    if (mergedDefaults.absoluteSize !== this.defaults.absoluteSize) {
      this.defaults.absoluteSize = mergedDefaults.absoluteSize
      this.updateAllAbsoluteSizes(nodes)
    }
    if (mergedDefaults.scale !== this.defaults.scale) {
      this.defaults.scale = mergedDefaults.scale
      this.updateAllScales(nodes)
    }
    if (mergedDefaults.innerRadius !== this.defaults.innerRadius) {
      this.defaults.innerRadius = mergedDefaults.innerRadius
      this.updateAllInnerRadii(nodes)
    }
    if (
      mergedDefaults.fill !== this.defaults.fill ||
      mergedDefaults.fillOpacity !== this.defaults.fillOpacity
    ) {
      this.defaults.fill = mergedDefaults.fill
      this.defaults.fillOpacity = mergedDefaults.fillOpacity
      this.updateAllFills(nodes)
    }
    if (mergedDefaults.stroke !== this.defaults.stroke) {
      this.defaults.stroke = mergedDefaults.stroke
      this.updateAllStrokes(nodes)
    }
    if (mergedDefaults.strokeWidth !== this.defaults.strokeWidth) {
      this.defaults.strokeWidth = mergedDefaults.strokeWidth
      this.updateAllStrokeWidths(nodes)
    }
    if (mergedDefaults.strokeOpacity !== this.defaults.strokeOpacity) {
      this.defaults.strokeOpacity = mergedDefaults.strokeOpacity
      this.updateAllStrokeOpacities(nodes)
    }
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
    const numNodes = size(nodes)
    this.initPositionIfNeeded(numNodes)

    const position = this.geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute
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
    const numNodes = size(nodes)
    this.initAbsoluteSizeIfNeeded(numNodes)

    const absoluteSize = this.geometry.getAttribute(
      'absoluteSize',
    ) as THREE.BufferAttribute
    for (let i = 0; i < numNodes; i++) {
      absoluteSize.setX(i, nodes[i].absoluteSize ?? this.defaults.absoluteSize)
    }

    absoluteSize.needsUpdate = true
  }

  /**
   * update scale attributes of all nodes
   * @param nodes
   */
  public updateAllScales = (nodes: DisplayNode[]) => {
    const numNodes = size(nodes)
    this.initScaleIfNeeded(numNodes)

    const scale = this.geometry.getAttribute('scale') as THREE.BufferAttribute
    for (let i = 0; i < numNodes; i++) {
      scale.setX(i, nodes[i].scale ?? this.defaults.scale)
    }

    scale.needsUpdate = true
  }

  /**
   * update innerRadius attributes of all nodes
   * @param nodes
   */
  public updateAllInnerRadii = (nodes: DisplayNode[]) => {
    const numNodes = size(nodes)
    this.initInnerRadiusIfNeeded(numNodes)

    const innerRadius = this.geometry.getAttribute(
      'innerRadius',
    ) as THREE.BufferAttribute
    for (let i = 0; i < numNodes; i++) {
      innerRadius.setX(i, nodes[i].innerRadius ?? this.defaults.innerRadius)
    }

    innerRadius.needsUpdate = true
  }

  /**
   * update fill and fillOpacity attributes of all nodes
   * @param nodes
   */
  public updateAllFills = (nodes: DisplayNode[]) => {
    const numNodes = size(nodes)
    this.initFillIfNeeded(numNodes)
    this.initFillOpacityIfNeeded(numNodes)

    const fill = this.geometry.getAttribute('fill') as THREE.BufferAttribute
    const fillOpacity = this.geometry.getAttribute(
      'fillOpacity',
    ) as THREE.BufferAttribute

    const tmpColor = new THREE.Color() // for reuse
    for (let i = 0; i < numNodes; i++) {
      tmpColor.set(defaultTo(nodes[i].fill, this.defaults.fill) as string)
      fill.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b)
      fillOpacity.setX(
        i,
        defaultTo(nodes[i].fillOpacity, this.defaults.fillOpacity),
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
    const numNodes = size(nodes)
    this.initStrokeIfNeeded(numNodes)

    const stroke = this.geometry.getAttribute('stroke') as THREE.BufferAttribute
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
    const numNodes = size(nodes)
    this.initStrokeWidthIfNeeded(numNodes)

    const strokeWidth = this.geometry.getAttribute(
      'strokeWidth',
    ) as THREE.BufferAttribute
    for (let i = 0; i < numNodes; i++) {
      // preserve stroke widths during data updates for locked nodes
      if (!this.lockedIds[i]) {
        strokeWidth.setX(
          i,
          defaultTo(nodes[i].strokeWidth, this.defaults.strokeWidth),
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
    const numNodes = size(nodes)
    this.initStrokeOpacityIfNeeded(numNodes)

    const strokeOpacity = this.geometry.getAttribute(
      'strokeOpacity',
    ) as THREE.BufferAttribute
    for (let i = 0; i < numNodes; i++) {
      if (!this.lockedIds[i]) {
        strokeOpacity.setX(
          i,
          defaultTo(nodes[i].strokeOpacity, this.defaults.strokeOpacity),
        )
      }
    }

    strokeOpacity.needsUpdate = true
  }
}
