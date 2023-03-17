import GSAP from 'gsap'
import { Mesh, Plane, Program } from 'ogl'

import fragment from 'shaders/projects-fragment.glsl'
import vertex from 'shaders/projects-vertex.glsl'

export default class {
  constructor ({ gl, scene, sizes, url }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
    this.url = url

    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20
    })
  }

  createProgram (texture) {
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: texture },
        uSpeed: { value: 0 },
        uTime: { value: 0 }
      },
      transparent: true
    })
  }

  createMesh (mesh) {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.scale.x = mesh.scale.x
    this.mesh.scale.y = mesh.scale.y
    this.mesh.scale.z = mesh.scale.z

    this.mesh.position.x = mesh.position.x
    this.mesh.position.y = mesh.position.y
    this.mesh.position.z = mesh.position.z + 0.01

    this.mesh.rotation.x = mesh.rotation.x
    this.mesh.rotation.y = mesh.rotation.y
    this.mesh.rotation.z = mesh.rotation.z

    this.mesh.setParent(this.scene)
  }

  // Element

  setElement (element) {
    if (element.id === 'projects') {
      const { index, medias } = element
      const media = medias[index]

      this.createProgram(media.texture)
      this.createMesh(media.mesh)

      this.transition = 'detail'
    } else {
      this.createProgram(element.texture)
      this.createMesh(element.mesh)

      this.transition = 'projects'
    }
  }

  // Animations

  animate (element, onComplete) {
    const timeline = GSAP.timeline({ delay: 0.5 })

    timeline.to(this.mesh.scale, {
      duration: 2,
      ease: 'expo.inOut',
      x: element.scale.x,
      y: element.scale.y,
      z: element.scale.z
    }, 0)

    timeline.to(this.mesh.position, {
      duration: 2,
      ease: 'expo.inOut',
      x: element.position.x,
      y: element.position.y,
      z: element.position.z
    }, 0)

    timeline.to(this.mesh.rotation, {
      duration: 2,
      ease: 'expo.inOut',
      x: element.rotation.x,
      y: element.rotation.y + 6.3,
      z: element.rotation.z
    }, 0)

    timeline.call(_ => {
      onComplete()
    })

    timeline.call(_ => {
      this.scene.removeChild(this.mesh)
    }, null, '+=0.5') // prettier-ignore
  }
}
