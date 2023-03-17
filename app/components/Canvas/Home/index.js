import { Transform, Plane } from 'ogl'
import GSAP from 'gsap'
import Detection from 'classes/Detection'
import map from 'lodash/map'
import Media from './Media'

export default class {
  constructor ({ element, elements, gl, scene, sizes }) {
    this.element = element
    this.elements = elements
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
    this.group = new Transform()
    this.galleryElement = document.querySelector('.home__gallery')
    this.mediasElements = document.querySelectorAll('.home__gallery__media__image')
    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1
    }
    this.scrollCurrent = {
      x: 0,
      y: 0
    }
    this.scroll = {
      x: 0,
      y: 0
    }
    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1
    }
    this.velocity = 2

    this.createGeometry()
    this.createGallery()
    this.onResize({
      sizes: this.sizes
    })
  }

  createGeometry () {
    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20
    })
  }

  createGallery () {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        index,
        geometry: this.geometry,
        gl: this.gl,
        scene: this.scene,
        sizes: this.sizes
      })
    })
  }

  // Animations

  show (sizes) {
    this.group.setParent(this.scene)
    map(this.medias, media => media.show(sizes))
  }

  hide () {
    map(this.medias, media => media.hide())
  }

  // Events

  onResize (sizes) {
    this.galleryBounds = this.galleryElement.getBoundingClientRect()
    this.sizes = sizes.sizes
    if (Detection.isPhone()) {
      this.galleryBounds.height = this.galleryBounds.height + (this.galleryBounds.height / window.innerHeight * this.sizes.height) * 9
    }
    this.gallerySizes = {
      height: this.galleryBounds.height / window.innerHeight * this.sizes.height,
      width: this.galleryBounds.width / window.innerWidth * this.sizes.width
    }
    this.scroll.y = this.y.target = 0
    map(this.medias, media => media.onResize(sizes, this.scroll))
  }

  onTouchDown ({ x, y }) {
    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove ({ x, y }) {
    const distance = y.start - y.end
    this.y.target = this.scrollCurrent.y - distance
  }

  onTouchUp ({ x, y }) {}

  onWheel ({ pixelX, pixelY }) {
    this.y.target += pixelY
    this.velocity = pixelY > 0 ? 2 : -2
  }

  update () {
    this.y.target += this.velocity
    this.speed.target = 0.001 * (this.y.target - this.y.current)
    this.speed.current = GSAP.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp)
    this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)
    if (this.scroll.y < this.y.current) {
      this.y.direction = 'top'
    } else {
      this.scroll.y > this.y.current && (this.y.direction = 'bottom')
    }

    this.scroll.y = this.y.current
    map(this.medias, (media, index) => {
      const offsetX = 0.5 * this.sizes.height
      const scaleX = media.mesh.scale.y / 2
      this.y.direction === 'top' ? media.mesh.position.y + scaleX < -offsetX && (media.extra.y += this.gallerySizes.height) : this.y.direction === 'bottom' && media.mesh.position.y - scaleX > offsetX && (media.extra.y -= this.gallerySizes.height)
      media.update(this.scroll, this.speed.current)
    }
    )
  }

  // Destroy

  destroy () {
    this.scene.removeChild(this.group)
  }
}
