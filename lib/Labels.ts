import * as THREE from 'three'
import { PopulatedGraphVizLink } from './Links'

interface TextLabel {
  texture: THREE.Texture,
  size: THREE.Vector2,
  textSize: THREE.Vector2,
}

function buildTextLabel(text: string): TextLabel {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!

  const dpr = window.devicePixelRatio

  const fontSize = 8 * dpr
  // Font names copied from inspector.
  // TODO: get from theme?
  const fontString = `${fontSize}px "Roboto", "Helvetica", "Arial", sans-serif`

  // Measure the text we're about to write, then set the size of the canvas to fit:
  context.font = fontString
  const textWidth = context.measureText(text).width
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
    (canvas.width - textWidth) / 2, // center horizontally
    (canvas.height + fontSize) / 2 + verticalNudge, // center vertically (y is upside down)
  )

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

  return {
    texture,
    // Size of the texture in world coordinates:
    size: new THREE.Vector2(canvas.width / dpr, canvas.height / dpr),
    // Because of the power-of-2 constraint, the actual text can be a different
    // size:
    textSize: new THREE.Vector2(textWidth / dpr, textHeight / dpr),
  }
}

function buildMaterial(textLabel: TextLabel): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: {value: textLabel.texture},
      offset: {value: new THREE.Vector2(0, 0)},
      repeat: {value: new THREE.Vector2(1, 1)},
    },
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

export class Labels {
  public object: THREE.Object3D
  private planeGeometry: THREE.PlaneBufferGeometry
  private readonly meshes: {[linkIndex: number]: THREE.Mesh}
  private readonly textLabels: {[text: string]: TextLabel}

  constructor() {
    this.object = new THREE.Object3D()
    // We'll reuse this for every label:
    this.planeGeometry = new THREE.PlaneBufferGeometry(1, 1)
    this.meshes = {}
    this.textLabels = {}
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

      // Get a texture of the text for reuse:
      let textLabel = this.textLabels[link.label]
      if (!textLabel) {
        textLabel = buildTextLabel(link.label)
        this.textLabels[link.label] = textLabel
      }
      // TODO: dispose of unused textures

      if (!mesh) {
        mesh = new THREE.Mesh(this.planeGeometry, buildMaterial(textLabel))
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

      // The geometry is 1x1, so we set a scale transform to make it the right size:
      mesh.scale.x = Math.max(1e-6, textLabel.textSize.x)
      mesh.scale.y = textLabel.textSize.y

      const material = mesh.material as THREE.ShaderMaterial
      const offset = material.uniforms.offset.value as THREE.Vector2
      const repeat = material.uniforms.repeat.value as THREE.Vector2

      repeat.x = mesh.scale.x / textLabel.size.x
      repeat.y = mesh.scale.y / textLabel.size.y
      offset.x = (1 - repeat.x) / 2
      offset.y = (1 - repeat.y) / 2

      // TODO: plumb camera zoom through to here
      const fakeCameraZoom = 2
      mesh.scale.x /= fakeCameraZoom
      mesh.scale.y /= fakeCameraZoom
    })
  }
}
