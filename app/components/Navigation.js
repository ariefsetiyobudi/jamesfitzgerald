/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import GSAP from 'gsap'
import Component from 'classes/Component'
import { COLOR_BLACK, COLOR_WHITE, COLOR_ARGENT, COLOR_GRAY_X_ELEVEN, COLOR_OLD_SILVER } from 'utils/color'

export default class Navigation extends Component {
  constructor ({ template }) {
    super({
      element: '.navigation',
      elements: {
        logo: '.navigation__link',
        timestamp: '.navigation__timestamp',
        items: '.navigation__list__item',
        links: '.navigation__list__link',
        mobileButton: '.navigation__mobile__button',
        mobileButtonLabel: '.navigation__mobile__button__label',
        mobileMenu: '.navigation__mobile',
        mobileItem: '.navigation__mobile__list__item',
        mobileItemLink: '.navigation__mobile__list__link',
        mobileSocial: '.navigation__mobile__social__item',
        mobileSocialLink: '.navigation__mobile__social__link',
        switchButton: '#switch'
      }
    })

    this.onChange(template)
  }

  onChange (template) {
    if (template === 'about') {
      this.darkMode()
    } else {
      if (template === 'home') {
        if (this.element.classList.contains('open')) {
          this.menuEvents()
        }
      }
      this.lightMode()
    }

    this.template = template
  }

  lightMode () {
    GSAP.to(this.element, {
      background: COLOR_WHITE,
      color: COLOR_BLACK
    })

    GSAP.to(document.querySelector('#content'), {
      background: COLOR_WHITE,
      color: COLOR_BLACK
    })

    GSAP.to(document.querySelector('.cursor'), {
      background: COLOR_BLACK
    })
  }

  darkMode () {
    GSAP.to(this.element, {
      background: COLOR_BLACK,
      color: COLOR_WHITE
    })

    GSAP.to(document.querySelector('#content'), {
      background: COLOR_BLACK,
      color: COLOR_WHITE
    })

    GSAP.to(document.querySelector('.cursor'), {
      background: COLOR_WHITE
    })
  }

  switchEvents () {
    if (this.elements.switchButton.classList.contains('lights__off')) {
      this.elements.switchButton.classList.remove('lights__off')
      this.elements.switchButton.classList.add('lights__on')
      this.elements.switchButton.innerText = 'Lights On'
      this.darkMode()
    } else {
      this.elements.switchButton.classList.remove('lights__on')
      this.elements.switchButton.classList.add('lights__off')
      this.elements.switchButton.innerText = 'Lights Off'
      this.lightMode()
    }
  }

  menuEvents () {
    this.element.classList.toggle('open')
    this.elements.mobileButton.classList.toggle('open')
    this.elements.mobileMenu.classList.toggle('open')
    this.animateIn = GSAP.timeline({})
    if (this.element.classList.contains('open')) {
      this.animateIn.fromTo(this.elements.mobileMenu, {
        autoAlpha: 0
      }, {
        autoAlpha: 1,
        duration: 1,
        onStart: _ => {
          GSAP.fromTo([this.elements.mobileItemLink, this.elements.mobileSocialLink], {
            autoAlpha: 0,
            display: 'inline-block',
            y: '100%'
          }, {
            autoAlpha: 1,
            delay: 0.2,
            display: 'inline-block',
            duration: 1.5,
            ease: 'expo.out',
            stagger: {
              axis: 'y',
              amount: 1
            },
            y: '0%'
          })
        },
        ease: 'expo.out'
      }, 'start')

      this.elements.mobileButtonLabel.innerText = 'Close'
    } else {
      this.animateIn.fromTo([this.elements.mobileItemLink, this.elements.mobileSocialLink], {
        display: 'inline-block',
        y: '0%'
      }, {
        display: 'inline-block',
        duration: 1.5,
        ease: 'expo.out',
        stagger: {
          axis: 'y',
          amount: 1
        },
        y: '-100%',
        onComplete: _ => {
          GSAP.to(this.elements.mobileMenu, {
            autoAlpha: 0
          })
        }
      }, 'complete')

      this.elements.mobileButtonLabel.innerText = 'Menu'
    }
  }

  addEventListeners () {
    this.menuEvent = this.menuEvents.bind(this)
    this.switchEvent = this.switchEvents.bind(this)

    this.elements.mobileButton.addEventListener('click', this.menuEvent)
    this.elements.mobileItem.forEach((item) => {
      item.addEventListener('click', this.menuEvent)
    })
    this.elements.switchButton.addEventListener('click', this.switchEvent)
  }

  removeEventListeners () {
    this.elements.mobileButton.removeEventListener('click', this.menuEvent)
    this.elements.mobileItem.forEach((item) => {
      item.removeEventListener('click', this.menuEvent)
    })
    this.elements.switchButton.removeEventListener('click', this.switchEvent)
  }
}
