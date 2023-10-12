/* eslint-disable no-unused-vars */
/* eslint-disable no-new */
import GSAP from 'gsap'
import NormalizeWheel from 'normalize-wheel'

import each from 'lodash/each'
import * as screenOrientationJs from 'screen-orientation-js'

import Canvas from 'components/Canvas'
import Detection from 'classes/Detection'

import Navigation from 'components/Navigation'
import Preloader from 'components/Preloader'

import Home from 'pages/Home'
import Projects from 'pages/Projects'
import About from 'pages/About'
import Detail from 'pages/Detail'
class App {
  constructor () {
    this.createContent()
    this.createCanvas()
    this.createCursor()
    // this.createPreloader()
    this.createNavigation()
    this.createPages()
    this.preventLandscape()
    this.addEventListeners()
    this.addLinkListeners()
    this.onResize()
    this.update()
  }

  preventLandscape () {
    if (Detection.isPhone()) {
      screenOrientationJs.init({
        color: '#141414',
        bgColor: '#f2f2f2',
        animation: true,
        fontSize: 3
      })
    }
  }

  createCursor () {
    GSAP.set(document.querySelector('.cursor'), { force3D: true })
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX
      const y = e.clientY

      GSAP.to(document.querySelector('.cursor'), {
        autoAlpha: 1,
        x: x - 0,
        y: y - 0,
        ease: 'power3'
      })
    })

    document.body.addEventListener('mouseleave', () => {
      GSAP.to(document.querySelector('.cursor'), {
        autoAlpha: 1,
        scale: 0,
        duration: 0.1,
        ease: 'none'
      })
    })

    document.body.addEventListener('mouseenter', () => {
      GSAP.to(document.querySelector('.cursor'), {
        autoAlpha: 1,
        scale: 1,
        duration: 0.1,
        ease: 'none'
      })
    })
  }

  createCanvas () {
    this.canvas = new Canvas({
      template: this.template
    })
  }

  createPreloader () {
    this.preloader = new Preloader({
      canvas: this.canvas
    })

    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createNavigation () {
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages () {
    this.pages = {
      home: new Home(),
      projects: new Projects(),
      about: new About(),
      detail: new Detail()
    }
    this.page = this.pages[this.template]
    this.page.create()
    this.page.show()
  }

  // Events

  onPreloaded () {
    this.onResize()

    this.canvas.onPreloaded()

    this.page.show()
  }

  onPopState () {
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  async onChange ({ url, push = true }) {
    this.canvas.onChangeStart(this.template, url)

    await this.page.hide()

    const res = await window.fetch(url)

    if (res.status === 200) {
      const html = await res.text()
      const div = document.createElement('div')

      if (push) {
        window.history.pushState({}, '', url)
      }

      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      this.navigation.onChange(this.template)

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.canvas.onChangeEnd(this.template)

      this.page = this.pages[this.template]
      this.page.create()

      this.onResize()

      this.page.show()

      this.addLinkListeners()
    } else {
      console.error(`response status: ${res.status}`)
    }
  }

  onResize () {
    if (this.page && this.page.onResize) {
      this.page.onResize()
    }

    window.requestAnimationFrame(_ => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize()
      }
    })
  }

  onTouchDown (e) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(e)
    }
    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(e)
    }
  }

  onTouchMove (e) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(e)
    }
    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(e)
    }
  }

  onTouchUp (e) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(e)
    }
    if (this.page && this.page.onTouchUp) {
      this.page.onTouchUp(e)
    }
  }

  onWheel (e) {
    const normalizedWheel = NormalizeWheel(e)

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel)
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel)
    }
  }

  // Loop

  update () {
    if (this.page && this.page.update) {
      this.page.update()
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page.scroll)
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  // Listeners

  addEventListeners () {
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('DOMMouseScroll', this.onWheel.bind(this))
    window.addEventListener('mousewheel', this.onWheel.bind(this))
    window.addEventListener('mousewheel', this.onTouchMove.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a:not([target]')

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault()

        const { href } = link
        this.onChange({ url: href })
      }
    })
  }
}

new App()
