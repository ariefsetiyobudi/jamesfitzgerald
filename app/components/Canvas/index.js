/* eslint-disable no-unused-vars */
// import GSAP from 'gsap'
import { Camera, Renderer, Transform } from 'ogl'

import Home from './Home'
import About from './About'
import Projects from './Projects'
import Detail from './Detail'

export default class Canvas {
  constructor ({ template }) {
    this.template = template

    this.x = {
      start: 0,
      distance: 0,
      end: 0
    }

    this.y = {
      start: 0,
      distance: 0,
      end: 0
    }

    this.scroll = {
      ease: 0.05,
      current: 0,
      target: 0,
      last: 0
    }

    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
  }

  createRenderer () {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true
    })

    this.gl = this.renderer.gl

    document.body.appendChild(this.gl.canvas)
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.position.z = 10
  }

  createScene () {
    this.scene = new Transform()
  }

  //   Home
  createHome () {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes
    })
  }

  destroyHome () {
    if (!this.home) return

    this.home.destroy()
    this.home = null
  }

  //   about
  createAbout () {
    this.about = new About({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes
    })
  }

  destroyAbout () {
    if (!this.about) return

    this.about.destroy()
    this.about = null
  }

  //   projects
  createProjects () {
    this.projects = new Projects({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes
    })
  }

  destroyProjects () {
    if (!this.projects) return

    this.projects.destroy()
    this.projects = null
  }

  //   detail

  createDetail () {
    this.detail = new Detail({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes
    })
  }

  destroyDetail () {
    if (!this.detail) return

    this.detail.destroy()
    this.detail = null
  }

  // Events
  onPreloaded () {
    this.onChangeEnd(this.template)
  }

  onChangeStart (template, url) {
    if (this.home) {
      this.home.hide()
    }

    if (this.projects) {
      this.projects.hide()
    }

    if (this.detail) {
      this.detail.hide()
    }

    if (this.about) {
      this.about.hide()
    }
  }

  onChangeEnd (template) {
    if (template === 'home') {
      this.createHome()
    } else {
      this.destroyHome()
    }

    if (template === 'about') {
      this.createAbout()
    } else if (this.about) {
      this.destroyAbout()
    }

    if (template === 'detail') {
      this.createDetail()
    } else if (this.detail) {
      this.destroyDetail()
    }

    if (template === 'projects') {
      this.createProjects()
    } else if (this.projects) {
      this.destroyProjects()
    }

    this.template = template
  }

  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.sizes = {
      height,
      width
    }

    const values = {
      sizes: this.sizes
    }

    if (this.home) {
      this.home.onResize(values)
    }

    if (this.about) {
      this.about.onResize(values)
    }

    if (this.projects) {
      this.projects.onResize(values)
    }

    if (this.detail) {
      this.detail.onResize(values)
    }
  }

  onTouchDown (e) {
    this.isDown = true

    this.x.start = e.touches ? e.touches[0].clientX : e.clientX
    this.y.start = e.touches ? e.touches[0].clientY : e.clientY

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.home) {
      this.home.onTouchDown(values)
    }

    if (this.about) {
      this.about.onTouchDown(values)
    }

    if (this.projects) {
      this.projects.onTouchDown(values)
    }

    if (this.detail) {
      this.detail.onTouchDown(values)
    }
  }

  onTouchMove (e) {
    if (!this.isDown) return

    const x = e.touches ? e.touches[0].clientX : e.clientX
    const y = e.touches ? e.touches[0].clientY : e.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.home) {
      this.home.onTouchMove(values)
    }

    if (this.about) {
      this.about.onTouchMove(values)
    }

    if (this.projects) {
      this.projects.onTouchMove(values)
    }

    if (this.detail) {
      this.detail.onTouchMove(values)
    }
  }

  onTouchUp (e) {
    this.isDown = false

    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.isDown && this.home) {
      this.home.onTouchUp(values)
    }

    if (this.isDown && this.about) {
      this.about.onTouchUp(values)
    }

    if (this.isDown && this.projects) {
      this.projects.onTouchUp(values)
    }

    if (this.isDown && this.detail) {
      this.detail.onTouchUp(values)
    }
  }

  onWheel (e) {
    if (this.home) {
      this.home.onWheel(e)
    }

    if (this.about) {
      this.about.onWheel(e)
    }

    if (this.projects) {
      this.projects.onWheel(e)
    }

    if (this.detail) {
      this.detail.onWheel(e)
    }
  }

  // Loop.

  update (scroll) {
    if (this.home) {
      this.home.update(scroll)
    }

    if (this.about) {
      this.about.update(scroll)
    }

    if (this.projects) {
      this.projects.update(scroll)
    }

    if (this.detail) {
      this.detail.update(scroll)
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene
    })
  }
}
