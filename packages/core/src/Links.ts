import * as THREE from 'three'
import {VisualizationInputData} from './GraphVisualization'
import {DisplayNode, NODE_DEFAULTS} from './Nodes'
import {defaultTo, defaults, omit} from 'lodash'
import {Labels} from './Labels'
import {linksFragmentShader, linksVertexShader} from './shaders/asText'
import {BufferAttribute} from 'three'

/**
 * Constants
 */
const VERTICES_PER_QUAD = 6 // quads require 6 vertices (2 repeated)
const DEFAULT_LINK_WIDTH = 1

export interface LinkStyleAttributes {
  /**
   * determines whether an arrow is drawn on the link
   */
  directed?: boolean

  /**
   * determine whether the line should be dashed
   */
  dashed?: boolean

  /**
   * hex color string
   */
  color?: string

  /**
   * link opacity between 0 and 1
   * default is 1
   */
  opacity?: number

  /**
   * arrow width in pixels
   */
  arrowWidth?: number

  /**
   * relative scale of the label.
   * default is 1.0
   */
  labelScale?: number
}

export interface DisplayLink extends LinkStyleAttributes {
  source: string
  target: string
  /**
   * text to display
   */
  label?: string
}

export interface PopulatedDisplayLink extends LinkStyleAttributes {
  source: DisplayNode
  target: DisplayNode
  /**
   * text to display
   */
  label?: string
}

export const LINK_DEFAULTS = {
  directed: false,
  dashed: false,
  color: '#cccccc',
  opacity: 1,
  arrowWidth: 10,
  labelScale: 1,
}

export function populateLinks(
  graphData: VisualizationInputData,
  nodeIdToIdxMap: {[id: string]: number},
): PopulatedDisplayLink[] {
  return graphData.links.map(link => ({
    ...link,
    source: graphData.nodes[nodeIdToIdxMap[link.source]],
    target: graphData.nodes[nodeIdToIdxMap[link.target]],
  }))
}

const calculateAbsoluteArrowOffset = (link: PopulatedDisplayLink): number => {
  const relativePadding = 0.05 // space between arrow tip and edge of node border
  const outerRadius =
    defaultTo(link.target.innerRadius, NODE_DEFAULTS.innerRadius) +
    defaultTo(link.target.strokeWidth, NODE_DEFAULTS.strokeWidth)
  const absoluteContainerSize =
    defaultTo(link.target.absoluteSize, NODE_DEFAULTS.absoluteSize) *
    defaultTo(link.target.scale, NODE_DEFAULTS.scale)
  return (outerRadius + relativePadding) * absoluteContainerSize
}

export class Links {
  public object: THREE.Mesh

  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.ShaderMaterial
  private readonly labels: Labels

  private defaults: Required<LinkStyleAttributes> = LINK_DEFAULTS

  constructor(links: PopulatedDisplayLink[]) {
    const numLinks = links.length
    this.geometry = new THREE.BufferGeometry()
    this.initPositionIfNeeded(numLinks * VERTICES_PER_QUAD)
    this.initUvIfNeeded(numLinks * VERTICES_PER_QUAD)
    this.initQuadLengthIfNeeded(numLinks * VERTICES_PER_QUAD)
    this.initColorIfNeeded(numLinks * VERTICES_PER_QUAD)
    this.initOpacityIfNeeded(numLinks * VERTICES_PER_QUAD)
    this.initArrowWidthIfNeeded(numLinks * VERTICES_PER_QUAD)
    this.initArrowOffsetIfNeeded(numLinks * VERTICES_PER_QUAD)
    this.initDashGapIfNeeded(numLinks * VERTICES_PER_QUAD)

    this.material = new THREE.ShaderMaterial({
      vertexShader: linksVertexShader,
      fragmentShader: linksFragmentShader,
      transparent: true,
      uniforms: {
        lineWidth: {value: DEFAULT_LINK_WIDTH},
        globalScale: {value: window.devicePixelRatio}, // TODO: update this with camera zoom
      },
    })

    this.object = new THREE.Mesh(this.geometry, this.material)
    this.object.name = 'lines'

    this.labels = new Labels()
    this.labels.object.position.z = 1 // put in front of the lines
    this.object.add(this.labels.object)

    this.updateAll(links)
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

  private initUvIfNeeded(numVertices: number) {
    const attrName = 'uv'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices * 2), 2),
      )
    }
  }

  private initQuadLengthIfNeeded(numVertices: number) {
    const attrName = 'quadLength'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices), 1),
      )
    }
  }

  private initColorIfNeeded(numVertices: number) {
    const attrName = 'color'
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

  private initOpacityIfNeeded(numVertices: number) {
    const attrName = 'opacity'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices), 1),
      )
    }
  }

  private initArrowWidthIfNeeded(numVertices: number) {
    const attrName = 'arrowWidth'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices), 1),
      )
    }
  }

  private initArrowOffsetIfNeeded(numVertices: number) {
    const attrName = 'arrowOffset'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices), 1),
      )
    }
  }

  private initDashGapIfNeeded(numVertices: number) {
    const attrName = 'dashGap'
    const attr = this.geometry.getAttribute(attrName) as
      | BufferAttribute
      | undefined
    if (attr === undefined || attr.count !== numVertices) {
      this.geometry.setAttribute(
        attrName,
        new THREE.BufferAttribute(new Float32Array(numVertices), 1),
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
    this.labels.dispose()
  }

  /**
   * update default attrs for all links
   * undefined values reset to default
   * @param newDefaults
   * @param links
   */
  public updateDefaults = (
    newDefaults: LinkStyleAttributes | undefined,
    links: PopulatedDisplayLink[],
  ) => {
    this.defaults = defaults(
      {},
      omit(newDefaults, 'labelScale'), // handle labelScale separately for perf reasons
      LINK_DEFAULTS, // reset undefined values to default values
      this.defaults, // preserve the other keys
    )

    // Note: optimize this for a per-attribute basis when
    this.updateAll(links)

    if (this.defaults.labelScale !== newDefaults?.labelScale) {
      this.defaults.labelScale =
        newDefaults?.labelScale ?? LINK_DEFAULTS.labelScale
      this.labels.updateDefaults({scale: this.defaults.labelScale}, links)
    }
  }

  /**
   * update all attributes for all links
   * @param links
   */
  public updateAll = (links: PopulatedDisplayLink[]) => {
    this.updateAllPositions(links)
    this.updateAllColors(links)
    this.updateAllLabels(links)
  }

  /**
   * update position, uv, quadLength, linkOffset, arrowHeight and dashGap attributes for all links
   * @param links
   */
  public updateAllPositions = (links: PopulatedDisplayLink[]) => {
    const numLinks = links.length
    const numVertices = numLinks * VERTICES_PER_QUAD
    this.initPositionIfNeeded(numVertices)
    this.initUvIfNeeded(numVertices)
    this.initQuadLengthIfNeeded(numVertices)
    this.initArrowWidthIfNeeded(numVertices)
    this.initArrowOffsetIfNeeded(numVertices)
    this.initDashGapIfNeeded(numVertices)

    let labelsNeedUpdate = false

    const position = this.geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute
    const uv = this.geometry.getAttribute('uv') as THREE.BufferAttribute
    const quadLength = this.geometry.getAttribute(
      'quadLength',
    ) as THREE.BufferAttribute
    const arrowWidth = this.geometry.getAttribute(
      'arrowWidth',
    ) as THREE.BufferAttribute
    const arrowOffset = this.geometry.getAttribute(
      'arrowOffset',
    ) as THREE.BufferAttribute
    const dashGap = this.geometry.getAttribute(
      'dashGap',
    ) as THREE.BufferAttribute

    const source = new THREE.Vector2()
    const target = new THREE.Vector2()
    const tangent = new THREE.Vector2()
    const normal = new THREE.Vector2()

    for (let i = 0; i < numLinks; i++) {
      source.set(links[i].source.x!, links[i].source.y!)
      target.set(links[i].target.x!, links[i].target.y!)

      tangent.copy(target).sub(source)

      const quadWidth = links[i].directed
        ? Math.max(
            DEFAULT_LINK_WIDTH,
            links[i].arrowWidth ?? this.defaults.arrowWidth,
          )
        : DEFAULT_LINK_WIDTH

      normal.set(-tangent.y, tangent.x) // rotate 90 degrees to make it normal to the link
      normal.normalize().multiplyScalar(quadWidth / 2)

      const totalLength = tangent.length()

      // The four corners of the quad:
      const a = source.clone().add(normal)
      const b = source.clone().sub(normal)
      const c = target.clone().add(normal)
      const d = target.clone().sub(normal)
      // TODO: OPTIMIZE: don't clone these 4 vectors

      // First triangle:
      position.setXYZ(i * VERTICES_PER_QUAD + 0, a.x, a.y, 0)
      position.setXYZ(i * VERTICES_PER_QUAD + 1, b.x, b.y, 0)
      position.setXYZ(i * VERTICES_PER_QUAD + 2, c.x, c.y, 0)
      // Second triangle, repeating two of the vertices in the first triangle:
      position.setXYZ(i * VERTICES_PER_QUAD + 3, d.x, d.y, 0)
      position.setXYZ(i * VERTICES_PER_QUAD + 4, c.x, c.y, 0)
      position.setXYZ(i * VERTICES_PER_QUAD + 5, b.x, b.y, 0)

      // First triangle, in coordinates relative to the quad:
      uv.setXY(i * VERTICES_PER_QUAD + 0, 0, 0)
      uv.setXY(i * VERTICES_PER_QUAD + 1, quadWidth, 0)
      uv.setXY(i * VERTICES_PER_QUAD + 2, 0, totalLength)
      // Second triangle:
      uv.setXY(i * VERTICES_PER_QUAD + 3, quadWidth, totalLength)
      uv.setXY(i * VERTICES_PER_QUAD + 4, 0, totalLength)
      uv.setXY(i * VERTICES_PER_QUAD + 5, quadWidth, 0)

      // Repeat for all vertices of this quad:
      for (
        let vertexIndex = i * VERTICES_PER_QUAD;
        vertexIndex < (i + 1) * VERTICES_PER_QUAD;
        vertexIndex++
      ) {
        quadLength.setX(vertexIndex, totalLength)

        if (links[i].directed) {
          arrowWidth.setX(
            vertexIndex,
            links[i].arrowWidth ?? this.defaults.arrowWidth,
          )
          arrowOffset.setX(vertexIndex, calculateAbsoluteArrowOffset(links[i]))
        } else {
          arrowWidth.setX(vertexIndex, 0)
          arrowOffset.setX(vertexIndex, 0)
        }

        if (links[i].dashed) {
          dashGap.setX(vertexIndex, 5)
        } else {
          dashGap.setX(vertexIndex, 0)
        }
      }

      if (links[i].label) {
        labelsNeedUpdate = true
      }
    }

    if (labelsNeedUpdate) {
      // For now, just updating all of the labels if any of the links even have a
      // label. If we're moving the links, we need to move the labels too!
      this.updateAllLabels(links)
    }

    position.needsUpdate = true
    uv.needsUpdate = true
    quadLength.needsUpdate = true
    arrowWidth.needsUpdate = true
    arrowOffset.needsUpdate = true
    dashGap.needsUpdate = true

    this.geometry.computeBoundingSphere()
  }

  /**
   * update color attributes for all links
   * @param links
   */
  public updateAllColors = (links: PopulatedDisplayLink[]) => {
    const numLinks = links.length
    const numVertices = numLinks * VERTICES_PER_QUAD

    this.initColorIfNeeded(numVertices)
    this.initOpacityIfNeeded(numVertices)

    const color = this.geometry.getAttribute('color') as THREE.BufferAttribute
    const opacity = this.geometry.getAttribute(
      'opacity',
    ) as THREE.BufferAttribute

    const tmpColor = new THREE.Color() // for reuse
    for (let i = 0; i < numLinks; i++) {
      const currentLink = links[i]
      tmpColor.set(defaultTo(currentLink.color, this.defaults.color) as string)
      // Repeat for all vertices of this quad:
      for (
        let vertexIndex = i * VERTICES_PER_QUAD;
        vertexIndex < (i + 1) * VERTICES_PER_QUAD;
        vertexIndex++
      ) {
        color.setXYZ(vertexIndex, tmpColor.r, tmpColor.g, tmpColor.b)
        opacity.setX(
          vertexIndex,
          defaultTo(currentLink.opacity, this.defaults.opacity) as number,
        )
      }
    }

    color.needsUpdate = true
    opacity.needsUpdate = true
  }

  // updateAllLabels must be called directly when the _text_ of the labels
  // change. Calling updateAllPositions will do this automatically, because the
  // labels always need updating if the links move.
  public updateAllLabels = (links: PopulatedDisplayLink[]) => {
    this.labels.updateAll(links)
  }
}
