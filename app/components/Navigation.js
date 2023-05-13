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
        mobileButtonLines: '.navigation__mobile__menu',
        mobileMenu: '.navigation__mobile',
        mobileItem: '.navigation__mobile__list__item',
        switchButton: '#switch'
      }
    })

    this.onChange(template)
  }

  onChange (template) {
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
