import * as THREE from 'three'
import { GraphVizData } from './GraphVisualization'
import { GraphVizNode } from './Nodes'
import fragmentShader from './shaders/links.fragment.glsl'
import vertexShader from './shaders/links.vertex.glsl'
import { defaultTo } from 'lodash'

const VERTICES_PER_QUAD = 6 // quads require 6 vertices (2 repeated)
// TODO: make arrowWidth an attribute so it can be customized per node instead of being derived from QuadWidth
const QUAD_WIDTH = 15

/**
 * Constants
 */
const DEFAULT_LINK_COLOR = 0xbbbbbb
const HIGHLIGHTED_LINK_COLOR = 0x333333

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
   * hex color string or hex number
   */
  color?: string | number
}

export interface GraphVizLink extends LinkStyleAttributes {
  source: string
  target: string
}

export interface PopulatedGraphVizLink extends LinkStyleAttributes {
  source: GraphVizNode
  target: GraphVizNode
}

export function getPopulatedGraphLinks(
  graphData: GraphVizData,
  nodeIdToIdxMap: {[id: string]: number},
  ): PopulatedGraphVizLink[] {
  return graphData.links.map(link => ({
    ...link,
    source: graphData.nodes[nodeIdToIdxMap[link.source]],
    target: graphData.nodes[nodeIdToIdxMap[link.target]],
  }))
}

export class Links {
  public object: THREE.Mesh

  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.ShaderMaterial

  constructor(links: PopulatedGraphVizLink[]) {
    const numLinks = links.length
    const numVertices = numLinks * VERTICES_PER_QUAD

    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numVertices * 3), 3))
    this.geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(numVertices * 2), 2))
    this.geometry.addAttribute('quadLength', new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1))
    this.geometry.addAttribute('linkOffset', new THREE.BufferAttribute(new Float32Array(numVertices * 1), 1))
    this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numVertices * 3), 3))
    this.geometry.addAttribute('arrowHeight', new THREE.BufferAttribute((new Float32Array(numVertices * 1)), 1))
    this.geometry.addAttribute('dashGap', new THREE.BufferAttribute((new Float32Array(numVertices * 1)), 1))

    this.updateAll(links)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        quadWidth: {value: QUAD_WIDTH},
        lineWidth: {value: 0.5},
        globalScale: {value: window.devicePixelRatio}, // TODO: update this with camera zoom
      },
    })

    this.object = new THREE.Mesh(this.geometry, this.material)
    this.object.name = 'lines'
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
   * update all attributes for all links
   * @param links
   */
  public updateAll = (links: PopulatedGraphVizLink[]) => {
    this.updateAllPositions(links)
    this.updateAllColors(links)
  }

  /**
   * update position, uv, quadLength, linkOffset, arrowHeight and dashGap attributes for all links
   * @param links
   */
  public updateAllPositions = (links: PopulatedGraphVizLink[]) => {
    const position = this.geometry.getAttribute('position') as THREE.BufferAttribute
    const uv = this.geometry.getAttribute('uv') as THREE.BufferAttribute
    const quadLength = this.geometry.getAttribute('quadLength') as THREE.BufferAttribute
    const linkOffset = this.geometry.getAttribute('linkOffset') as THREE.BufferAttribute
    const arrowHeight = this.geometry.getAttribute('arrowHeight') as THREE.BufferAttribute
    const dashGap = this.geometry.getAttribute('dashGap') as THREE.BufferAttribute

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

    if (numVertices !== linkOffset.count) {
      linkOffset.setArray(new Float32Array(numVertices * linkOffset.itemSize))
    }

    if (numVertices !== arrowHeight.count) {
      arrowHeight.setArray(new Float32Array(numVertices * arrowHeight.itemSize))
    }

    if (numVertices !== dashGap.count) {
      dashGap.setArray(new Float32Array(numVertices * dashGap.itemSize))
    }

    const source = new THREE.Vector2()
    const target = new THREE.Vector2()
    const tangent = new THREE.Vector2()
    const normal = new THREE.Vector2()

    for (let i = 0; i < numLinks; i++) {
      source.set(links[i].source.x!, links[i].source.y!)
      target.set(links[i].target.x!, links[i].target.y!)

      tangent.copy(target).sub(source)

      normal.set(-tangent.y, tangent.x) // rotate 90 degrees to make it normal to the link
      normal.normalize().multiplyScalar(QUAD_WIDTH / 2)

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
      uv.setXY(i * VERTICES_PER_QUAD + 1, QUAD_WIDTH, 0)
      uv.setXY(i * VERTICES_PER_QUAD + 2, 0, totalLength)
      // Second triangle:
      uv.setXY(i * VERTICES_PER_QUAD + 3, QUAD_WIDTH, totalLength)
      uv.setXY(i * VERTICES_PER_QUAD + 4, 0, totalLength)
      uv.setXY(i * VERTICES_PER_QUAD + 5, QUAD_WIDTH, 0)

      // Repeat for all vertices of this quad:
      for (let vertexIndex = i * VERTICES_PER_QUAD; vertexIndex < (i + 1) * VERTICES_PER_QUAD; vertexIndex++) {
        quadLength.setX(vertexIndex, totalLength)

        if (links[i].directed) {
          arrowHeight.setX(vertexIndex, QUAD_WIDTH / 2.0)

          // FIXME:
          // This is hardcoded right now:
          // ((nodeInnerRadius=0.2)+(padding=0.04)) * (nodeSize=20.0)
          // Instead we should pass passing 0.24 to the fragment shader and do this calculation within the shader
          const offset = 0.24 * 20.0
          linkOffset.setX(vertexIndex, offset)
        } else {
          arrowHeight.setX(vertexIndex, 0)
          linkOffset.setX(vertexIndex, 0)
        }

        if (links[i].dashed) {
          dashGap.setX(vertexIndex, 10)
        } else {
          dashGap.setX(vertexIndex, 0)
        }
      }
    }

    position.needsUpdate = true
    uv.needsUpdate = true
    quadLength.needsUpdate = true
    linkOffset.needsUpdate = true
    arrowHeight.needsUpdate = true
    dashGap.needsUpdate = true

    this.geometry.computeBoundingSphere()
  }

  /**
   * update color attributes for all links
   * @param links
   */
  public updateAllColors = (links: PopulatedGraphVizLink[]) => {
    const color = this.geometry.getAttribute('color') as THREE.BufferAttribute

    const numLinks = links.length
    const numVertices = numLinks * VERTICES_PER_QUAD

    if (numVertices !== color.count) {
      color.setArray(new Float32Array(numVertices * color.itemSize))
    }

    const tmpColor = new THREE.Color() // for reuse

    for (let i = 0; i < numLinks; i++) {
      const currentLink = links[i]
      tmpColor.set(defaultTo(currentLink.color, DEFAULT_LINK_COLOR) as string)
      // Repeat for all vertices of this quad:
      for (let vertexIndex = i * VERTICES_PER_QUAD; vertexIndex < (i + 1) * VERTICES_PER_QUAD; vertexIndex++) {
        color.setXYZ(vertexIndex, tmpColor.r, tmpColor.g, tmpColor.b)
      }
    }

    color.needsUpdate = true
  }
}
