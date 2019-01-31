import * as THREE from 'three'
import { PopulatedGraphVizLink } from './Links'

interface TextLabel {
  texture: THREE.Texture,
  width: number,
  height: number,
}

function buildTextLabel(text: string): TextLabel {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!

  const dpr = window.devicePixelRatio

  const size = 12 * dpr
  // Font names copied from inspector.
  // TODO: get from theme?
  context.font = `${size}px "Roboto", "Helvetica", "Arial", sans-serif`

  // Measure the text we're about to write, then set the size of the canvas to fit:
  const width = context.measureText(text).width
  // WebGL textures need to have power-of-two dimensions:
  canvas.width = THREE.Math.ceilPowerOfTwo(width)
  canvas.height = THREE.Math.ceilPowerOfTwo(size)

  // Gradient background for debugging:
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#ff3333')
  gradient.addColorStop(1, '#3333ff')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Now we can actually draw the text:
  context.fillStyle = 'black'
  context.textBaseline = 'bottom'
  context.font = `${size}px "Roboto", "Helvetica", "Arial", sans-serif`
  const verticalNudge = 1 // this makes it look right...
  context.fillText(
    text,
    (canvas.width - width) / 2, // center horizontally
    (canvas.height + size) / 2 + verticalNudge, // center vertically (y is upside down)
  )

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

  return {
    texture,
    // Size of the texture in world coordinates:
    width: canvas.width / dpr,
    height: canvas.height / dpr,
  }
}

export class Labels {
  public object: THREE.Object3D
  private readonly meshes: {[linkIndex: number]: THREE.Mesh}
  private readonly textLabels: {[text: string]: TextLabel}

  constructor() {
    this.object = new THREE.Object3D()
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
        mesh = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(1, 1),
          new THREE.MeshBasicMaterial({
            // transparent: true,
            map: textLabel.texture,
          }),
        )
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
      const linkLength = Math.sqrt(dx * dx + dy * dy)
      mesh.scale.x = Math.max(0, Math.min(linkLength - 20, textLabel.width))
      mesh.scale.y = textLabel.height
      // FIXME: don't stretch
    })
  }
}
