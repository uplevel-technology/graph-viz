import * as THREE from 'three'
import {VisualizationInputData} from './GraphVisualization'
import {
  DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE,
  DEFAULT_NODE_INNER_RADIUS,
  DEFAULT_NODE_SCALE,
  DisplayNode,
} from './Nodes'
import {defaultTo} from 'lodash'
import {Labels} from './Labels'
import {linksFragmentShader, linksVertexShader} from './shaders/asText'

const VERTICES_PER_QUAD = 6 // quads require 6 vertices (2 repeated)

/**
 * Constants
 */
export const DEFAULT_LINK_COLOR = '#cccccc'
export const DEFAULT_LINK_WIDTH = 1
export const HIGHLIGHTED_LINK_COLOR = '#333333'
export const DEFAULT_ARROW_WIDTH = 10
export const LARGE_ARROW_WIDTH = 20
export const DEFAULT_LINK_OPACITY = 1.0

interface LinkStyleAttributes {
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
   * text to display
   */
  label?: string

  /**
   * relative scale of the label.
   * default is 1.0
   */
  labelScale?: number
}

export interface DisplayLink extends LinkStyleAttributes {
  source: string
  target: string
}

export interface PopulatedDisplayLink extends LinkStyleAttributes {
  source: DisplayNode
  target: DisplayNode
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
    defaultTo(link.target.innerRadius, DEFAULT_NODE_INNER_RADIUS) +
    defaultTo(link.target.strokeWidth, 0)
  const absoluteContainerSize =
    defaultTo(link.target.absoluteSize, DEFAULT_NODE_CONTAINER_ABSOLUTE_SIZE) *
    defaultTo(link.target.scale, DEFAULT_NODE_SCALE)
  return (outerRadius + relativePadding) * absoluteContainerSize
}

export class Links {
  public object: THREE.Mesh

  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.ShaderMaterial

  private readonly labels: Labels

  constructor(links: PopulatedDisplayLink[]) {
    const numLinks = links.length
    const numVertices = numLinks * VERTICES_PER_QUAD

    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(numVertices * 3), 3),
    )
    this.geometry.addAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(numVertices * 2), 2),
    )
    this.geometry.addAttribute(
      'quadLength',
      new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
    )
    this.geometry.addAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(numVertices * 3), 3),
    )
    this.geometry.addAttribute(
      'opacity',
      new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
    )
    this.geometry.addAttribute(
      'arrowWidth',
      new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
    )
    this.geometry.addAttribute(
      'arrowOffset',
      new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
    )
    this.geometry.addAttribute(
      'dashGap',
      new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1),
    )

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

    const numLinks = links.length
    const numVertices = numLinks * VERTICES_PER_QUAD

    if (numVertices !== position.count) {
      position.setArray(new Float32Array(numVertices * position.itemSize))
    }

    if (numVertices !== uv.count) {
      uv.setArray(new Float32Array(numVertices * uv.itemSize))
    }

    if (numVertices !== quadLength.count) {
      quadLength.setArray(new Float32Array(numVertices * quadLength.itemSize))
    }

    if (numVertices !== arrowWidth.count) {
      arrowWidth.setArray(new Float32Array(numVertices * arrowWidth.itemSize))
    }

    if (numVertices !== arrowOffset.count) {
      arrowOffset.setArray(new Float32Array(numVertices * arrowOffset.itemSize))
    }

    if (numVertices !== dashGap.count) {
      dashGap.setArray(new Float32Array(numVertices * dashGap.itemSize))
    }

    let labelsNeedUpdate = false

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
            links[i].arrowWidth || DEFAULT_ARROW_WIDTH,
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
            links[i].arrowWidth || DEFAULT_ARROW_WIDTH,
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
    const color = this.geometry.getAttribute('color') as THREE.BufferAttribute
    const opacity = this.geometry.getAttribute(
      'opacity',
    ) as THREE.BufferAttribute

    const numLinks = links.length
    const numVertices = numLinks * VERTICES_PER_QUAD

    if (numVertices !== color.count) {
      color.setArray(new Float32Array(numVertices * color.itemSize))
    }
    if (numVertices !== opacity.count) {
      opacity.setArray(new Float32Array(numVertices * opacity.itemSize))
    }

    const tmpColor = new THREE.Color() // for reuse

    for (let i = 0; i < numLinks; i++) {
      const currentLink = links[i]
      tmpColor.set(defaultTo(currentLink.color, DEFAULT_LINK_COLOR) as string)
      // Repeat for all vertices of this quad:
      for (
        let vertexIndex = i * VERTICES_PER_QUAD;
        vertexIndex < (i + 1) * VERTICES_PER_QUAD;
        vertexIndex++
      ) {
        color.setXYZ(vertexIndex, tmpColor.r, tmpColor.g, tmpColor.b)
        opacity.setX(
          vertexIndex,
          defaultTo(currentLink.opacity, DEFAULT_LINK_OPACITY) as number,
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
