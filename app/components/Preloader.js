/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Texture } from 'ogl'

import GSAP from 'gsap'

import Component from 'classes/Component'

import each from 'lodash/each'

import { split } from 'utils/text'

export default class Preloader extends Component {
  constructor ({ canvas }) {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text'
      }
    })

    this.canvas = canvas

    window.TEXTURES = {}

    this.elements.titleSpans = split({
      append: true,
      element: this.elements.title,
      expression: '<br>'
    })

    each(this.elements.titleSpans, spans => {
      split({
        append: false,
        element: spans,
        expression: ''
      })
    }
    )

    // this.elements.titleSpans = this.elements.title.querySelectorAll('span')

    this.length = 0
    this.createLoader()
  }

  createLoader () {
    this.animateIn = GSAP.timeline({})
    this.animateIn.set(this.elements.title, {
      autoAlpha: 1
    })

    each(this.elements.titleSpans, (element, percent) => {
      const span = element.querySelectorAll('span')
      this.animateIn.fromTo(element, {
        autoAlpha: 0,
        y: '100%'
      }, {
        autoAlpha: 1,
        delay: 0.2 * percent,
        duration: 1.5,
        onStart: element => {
          GSAP.fromTo(span, {
            autoAlpha: 0,
            display: 'inline-block',
            y: '100%'
          }, {
            autoAlpha: 1,
            delay: 0.2,
            display: 'inline-block',
            duration: 1,
            ease: 'back.inOut',
            stagger: 0.015,
            y: '0%'
          })
        },
        ease: 'expo.inOut',
        y: '0%'
      }, 'start')
    }
    )

    this.animateIn.call(_ => {
      each(window.ASSETS, (image) => {
        const texture = new Texture(this.canvas.gl, {
          generateMipmaps: false
        })

        const media = new window.Image()

        media.crossOrigin = 'anonymous'
        media.src = image

        media.onload = _ => {
          texture.image = media

          this.onAssetLoaded()
        }

        window.TEXTURES[image] = texture
      })
    })
  }

  onAssetLoaded (image) {
    this.length++

    const percent = this.length / window.ASSETS.length

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }
  }

  onLoaded () {
    return new Promise((resolve) => {
      this.emit('completed')

      this.animateOut = GSAP.timeline({
        delay: 1
      })

      each(this.elements.titleSpans, (element, percent) => {
        const span = element.querySelectorAll('span')
        this.animateOut.to(element, {
          autoAlpha: 0,
          delay: 0.2 * percent,
          duration: 1.5,
          onStart: element => {
            GSAP.to(span, {
              autoAlpha: 0,
              delay: 0.2,
              display: 'inline-block',
              duration: 1,
              ease: 'back.inOut',
              stagger: 0.015,
              y: '-100%'
            })
          },
          ease: 'expo.inOut',
          y: '-100%'
        }, 'start')
      }
      )

      this.animateOut.to(
        this.elements.numberText, {
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out'
        }, 'start'
      )

      this.animateOut.to(
        this.element, {
          autoAlpha: 0,
          duration: 1
        }
      )

      this.animateOut.call(_ => {
        this.destroy()
      })
    })
  }

  destroy () {
    this.element.parentNode.removeChild(this.element)
  }
}
