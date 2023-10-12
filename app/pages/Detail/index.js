/* eslint-disable camelcase */
import Page from 'classes/Page'
import Prefix from 'prefix'
export default class detail extends Page {
  constructor () {
    super({
      id: 'detail',
      element: '.detail',
      elements: {
        wrapper: '.detail__wrapper',
        navigation: document.querySelector('.navigation'),
        scrolltop: '.scrolltop__button'
      }
    })
    this.transformPrefix = Prefix('transform')
  }

  create () {
    super.create()
  }

  scrollTop () {
    this.y.end = 0
    this.scroll.target = this.y.end
    this.elements.wrapper.style[this.transformPrefix] = `translate3d(0px, -${this.y.end}px, 0px)`
  }

  addEventListeners () {
    this.scrollTopEvent = this.scrollTop.bind(this)

    this.elements.scrolltop.addEventListener('click', this.scrollTopEvent)
  }

  removeEventListeners () {
    this.elements.scrolltop.removeEventListener('click', this.scrollTopEvent)
  }

  destroy () {
    super.destroy()
  }
}
