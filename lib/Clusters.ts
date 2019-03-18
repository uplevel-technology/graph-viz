import * as THREE from 'three'
import {GraphVizNode} from './Nodes'
import {size} from 'lodash'
import fragmentShader from './shaders/nodes.fragment.glsl' // TODO maybe use a separate cluster shader
import vertexShader from './shaders/nodes.vertex.glsl'

export interface GraphVizCluster {
  /**
   * optional cluster id
   */
  clusterId: string

  /**
   * x coordinate of the cluster center
   */
  x: number

  /**
   * y coordinate of the cluster center
   */
  y: number

  /**
   * cluster fill
   * (default is 0x333333)
   */
  fill?: number | string

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
   * node strike color hex string or hex number
   */
  stroke?: number | string

  /**
   * relative node stroke opacity
   * (must be between 0.0 to 1.0)
   */
  strokeOpacity?: number

  /**
   * relative node stroke width
   * (This width is relative to the node container. Must be between 0.0 to 1.0)
   */
  strokeWidth?: number
}

export class Clusters {
  public object: THREE.Points

  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.ShaderMaterial

  constructor(nodes: GraphVizNode[]) {
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

    this.material = new THREE.ShaderMaterial({
      fragmentShader,
      transparent: true,
      uniforms: {
        globalScale: {value: window.devicePixelRatio},
        defaultColor: {value: new THREE.Color(0xffffff)},
      },
      vertexShader,
    })

    this.updateAll(nodes)
  }

  public handleCameraZoom = (zoom: number) => {
    this.material.uniforms.globalScale.value = zoom < 0.3 ? 0.3 : zoom
    this.material.uniforms.globalScale.value *= window.devicePixelRatio
  }

  public dispose = () => {
    this.geometry.dispose()
    this.material.dispose()
  }

  public updateAll(nodes: GraphVizNode[]) {
    console.log(this.computeClusters(nodes))
  }

  private computeClusters(nodes: GraphVizNode[]) {
    const nodesByClusters: {[clusterId: string]: GraphVizNode[]} = {}

    nodes.forEach(n => {
      if (n.clusterIds) {
        n.clusterIds.forEach(clusterId => {
          if (!nodesByClusters[clusterId]) {
            nodesByClusters[clusterId] = []
          }

          nodesByClusters[clusterId].push(n)
        })
      }
    })

    return nodesByClusters
  }
}
