import GSAP from 'gsap'

import Component from 'classes/Component'

import { COLOR_CHINESE_BLACK } from 'utils/color'

export default class Navigation extends Component {
  constructor ({ template }) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link'
      }
    })

    this.onChange(template)
  }

  onChange (template) {
    GSAP.to(this.element, {
      color: COLOR_CHINESE_BLACK
    })

    GSAP.to(this.elements.items[0], {
      autoAlpha: 0
    })

    GSAP.to(this.elements.items[1], {
      autoAlpha: 1
    })
  }
}
