import * as THREE from 'three'
import {VisualGraphLink} from './GraphVisualization'
import {DEFAULT_NODE_SIZE} from './Nodes'
import fragmentShader from './shaders/links.fragment.glsl'
import vertexShader from './shaders/links.vertex.glsl'

const VERTICES_PER_QUAD = 6 // quads require 6 vertices (2 repeated)
// TODO: make arrowWidth an attribute so it can be customized per node instead of being derived from QuadWidth
const QUAD_WIDTH = 15

const DEFAULT_COLOR = 0xbbbbbb
const HIGHLIGHTED_COLOR = 0x333333

export class Links {
  public object: THREE.Mesh

  private highlightEdges: boolean = false
  private links: VisualGraphLink[]
  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.ShaderMaterial

  constructor(links: VisualGraphLink[]) {
    this.links = links
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
    this.recalcPositionFromData(links)
    this.recalcColorFromData(links)

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

          // NOTE:
          // This is hardcoded right now: 0.2*nodeSize which is the absolute node radius within the point size
          // FIXME: don't hardcode, by passing 0.2 to the node shader somehow
          // TODO add 0.04*nodeSize for padding between arrow tip and node circumference
          const offset = 0.24 * (links[i].target.size || DEFAULT_NODE_SIZE)
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

  private recalcColorFromData = (links: VisualGraphLink[]) => {
    const color = this.geometry.getAttribute('color') as THREE.BufferAttribute

    const numLinks = links.length
    const numVertices = numLinks * VERTICES_PER_QUAD

    if (numVertices !== color.count) {
      color.setArray(new Float32Array(numVertices * color.itemSize))
    }

    const tmpColor = new THREE.Color() // for reuse

    for (let i = 0; i < numLinks; i++) {
      const currentLink = links[i]
      if (this.highlightEdges && !currentLink.source.inactive && !currentLink.target.inactive) {
        tmpColor.set(HIGHLIGHTED_COLOR)
      } else if (currentLink.color !== undefined) {
        tmpColor.set(currentLink.color as string)
      } else {
        tmpColor.set(DEFAULT_COLOR)
      }

      // Repeat for all vertices of this quad:
      for (let vertexIndex = i * VERTICES_PER_QUAD; vertexIndex < (i + 1) * VERTICES_PER_QUAD; vertexIndex++) {
        color.setXYZ(vertexIndex, tmpColor.r, tmpColor.g, tmpColor.b)
      }
    }

    color.needsUpdate = true
  }
}
