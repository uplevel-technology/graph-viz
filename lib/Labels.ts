import * as THREE from 'three'
import {PopulatedGraphVizLink} from './Links'
import {UPLEVEL_BASE_THEME} from '../../theme'

interface TextTexture {
  texture: THREE.Texture
  size: THREE.Vector2
  textSize: THREE.Vector2
}

function buildTexture(text: string): TextTexture {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!

  // On higher res displays, and so that we can zoom in and the text still looks
  // good, we render it at a bigger size, then pretend it was smaller.
  const extraScale = 4 * window.devicePixelRatio
  const xPadding = 2

  const fontSize = 4 * extraScale
  const fontString = `${fontSize}px ${UPLEVEL_BASE_THEME.typography.fontFamily}`

  // Measure the text we're about to write, then set the size of the canvas to fit:
  context.font = fontString
  const textWidth = context.measureText(text).width + xPadding * extraScale
  const textHeight = fontSize * 1.5 // make this up, big enough to show descender
  // WebGL textures need to have power-of-two dimensions:
  canvas.width = THREE.Math.ceilPowerOfTwo(textWidth)
  canvas.height = THREE.Math.ceilPowerOfTwo(textHeight)

  // Now we can actually draw the text:
  context.fillStyle = 'black'
  context.textBaseline = 'bottom'
  context.font = fontString // for some reason, we need to set this again
  const verticalNudge = 1 // "fudge factor" that makes it look right...
  context.fillText(
    text,
    (canvas.width - textWidth + xPadding * extraScale) / 2, // center horizontally
    (canvas.height + fontSize) / 2 + verticalNudge, // center vertically (y is upside down)
  )

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

  return {
    texture,
    // Size of the texture in world coordinates:
    size: new THREE.Vector2(canvas.width, canvas.height).divideScalar(
      extraScale,
    ),
    // Because of the power-of-two constraint, the actual text can be a
    // different size, and we want the caller to know:
    textSize: new THREE.Vector2(textWidth, textHeight).divideScalar(extraScale),
  }
}

interface Uniforms {
  map: {value: THREE.Texture}
  offset: {value: THREE.Vector2}
  repeat: {value: THREE.Vector2}
}

function buildMaterial(): THREE.ShaderMaterial {
  // Textures + MeshBasicMaterial supports repeat/offset, but these values
  // are owned by the _texture_, not the material. Because we expect textures
  // to be shared between materials on different meshes, we need to introduce
  // our own uniforms, and make the instance of the material in charge of them.

  const uniforms: Uniforms = {
    map: {value: new THREE.Texture()},
    offset: {value: new THREE.Vector2(0, 0)},
    repeat: {value: new THREE.Vector2(1, 1)},
  }

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      uniform vec2 offset;
      uniform vec2 repeat;
      varying vec2 vUV;
      void main() {
        vUV = uv * repeat + offset;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUV;
      uniform sampler2D map;
      void main() {
        gl_FragColor = texture2D(map, vUV);
      }
    `,
  })
}

function setMeshTexture(mesh: THREE.Mesh, texture: TextTexture) {
  // Even though this material was built with `buildMaterial`, we've lost some
  // type information by passing it through `mesh`. We gain that back here, by
  // explicitly telling the type checker to trust us:
  const material = mesh.material as THREE.ShaderMaterial
  const uniforms = (material.uniforms as unknown) as Uniforms

  // In case the text of the label had changed, make sure this mesh is
  // always showing the correct texture:
  uniforms.map.value = texture.texture

  // The geometry is 1x1, so we set a scale transform to make it the right size:
  mesh.scale.x = texture.textSize.x
  mesh.scale.y = texture.textSize.y

  // Setting repeat and offset tells the shader how to draw only the part of
  // the texture that includes the text, without stretching:
  const offset = uniforms.offset.value
  const repeat = uniforms.repeat.value
  repeat.x = mesh.scale.x / texture.size.x
  repeat.y = mesh.scale.y / texture.size.y
  offset.x = (1 - repeat.x) / 2
  offset.y = (1 - repeat.y) / 2
}

export class Labels {
  public readonly object: THREE.Object3D
  private readonly planeGeometry: THREE.PlaneBufferGeometry
  private readonly meshes: {[linkIndex: number]: THREE.Mesh}
  private readonly textures: {[text: string]: TextTexture}

  constructor() {
    this.object = new THREE.Object3D()
    // We'll reuse this for every label:
    this.planeGeometry = new THREE.PlaneBufferGeometry(1, 1)
    this.meshes = {}
    this.textures = {}
  }

  private getTexture(text: string): TextTexture {
    let texture = this.textures[text]
    if (!texture) {
      texture = buildTexture(text)
    }
    this.textures[text] = texture
    // TODO: dispose of unused textures
    return texture
  }

  public updateAll(links: PopulatedGraphVizLink[]) {
    links.forEach((link, index) => {
      let mesh = this.meshes[index]

      if (!link.label) {
        if (mesh) {
          this.object.remove(mesh)
          delete this.meshes[index]
        }
        return
      }

      if (!mesh) {
        mesh = new THREE.Mesh(this.planeGeometry, buildMaterial())
        this.meshes[index] = mesh
        this.object.add(mesh)
      }

      // Position at the center of the link:
      mesh.position.x = (link.source.x + link.target.x) / 2
      mesh.position.y = (link.source.y + link.target.y) / 2

      const dx = link.target.x - link.source.x
      const dy = link.target.y - link.source.y

      // Align with the link:
      mesh.rotation.z = Math.atan2(dy, dx)

      // Ensure that it's right-side up:
      if (mesh.rotation.z > Math.PI / 2) {
        mesh.rotation.z -= Math.PI
      }
      if (mesh.rotation.z < -Math.PI / 2) {
        mesh.rotation.z += Math.PI
      }

      setMeshTexture(mesh, this.getTexture(link.label))

      const linkLength = Math.sqrt(dx * dx + dy * dy)
      // Pad away from the ends of the link:
      // TODO: could use node size?
      const labelPadding = 20

      // TODO: if we want, we could swap out the label for ellipses if there
      // wouldn't be room, like so:
      // if (mesh.scale.x > linkLength - labelPadding) {
      //   setMeshTexture(mesh, this.getTexture('...'))
      // }

      // Completely hide if there still isn't room:
      mesh.visible = mesh.scale.x < linkLength - labelPadding

      // TODO: scale down if the camera is really zoomed in, to avoid the
      // ugliness of visible pixels, and also to make better use of space.
      // Also could be good to hide labels if the camera is really zoomed out.
    })
  }
}
