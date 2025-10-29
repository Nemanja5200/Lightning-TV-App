import Lightning from '@lightningjs/sdk/src/Lightning'

import { Utils } from '@lightningjs/sdk'
import { CardItem, HorizontalContainer, NavBar, VerticalContainer } from '../components'
import { ELEMENTS } from '../utils/Elements'

export default class Home extends Lightning.Component {
  _focusedComponent = ELEMENTS.NAVBAR
  static _template() {
    return {
      x: 0,
      y: 0,
      Background: {
        w: 1920,
        h: 1080,
        zIndex: -1,
      },
      NavBar: {
        type: NavBar,
      },
      Wrapper: {
        type: VerticalContainer,
        x: 64,
        y: 125,
        w: 1241,
      },
    }
  }

  _init() {
    const data = [
      { title: 'Movie 1', image: 'images/movie1.png' },
      { title: 'Movie 2', image: 'images/movie1.png' },
      { title: 'Movie 3', image: 'images/movie1.png' },
      { title: 'Movie 4', image: 'images/movie1.png' },
      { title: 'Movie 5', image: 'images/movie1.png' },
    ]

    const cardItems = data.map((item) => ({
      type: CardItem,
      item,
    }))

    const rows = [
      {
        type: HorizontalContainer,
        w: 1241,
        h: 464,
        props: {
          items: cardItems,
          railTitle: ELEMENTS.MOVIES,
          h: 359,
        },
      },
      {
        type: HorizontalContainer,
        w: 1241,
        h: 464,
        props: {
          items: cardItems,
          railTitle: ELEMENTS.SERIES,
          h: 359,
        },
      },
    ]

    this.tag(ELEMENTS.WRAPPER).patch({
      props: {
        items: rows,
      },
    })
  }

  set background(data) {
    this.tag(ELEMENTS.BACKGROUND).patch({
      src: Utils.asset(data.image),
      zIndex: data.zIndex ?? -100,
    })
  }

  _getFocused() {
    if (this._focusedComponent === ELEMENTS.NAVBAR) {
      return this.tag(ELEMENTS.NAVBAR)
    } else if (this._focusedComponent === ELEMENTS.WRAPPER) {
      return this.tag(ELEMENTS.WRAPPER)
    }
  }

  _handleDown() {
    if (this._focusedComponent === ELEMENTS.NAVBAR) {
      this._focusedComponent = ELEMENTS.WRAPPER
      return true
    }
    return false
  }

  _handleUp() {
    if (this._focusedComponent === ELEMENTS.WRAPPER) {
      const wrapper = this.tag(ELEMENTS.WRAPPER)
      if (wrapper._focusedIndex === 0) {
        this._focusedComponent = ELEMENTS.NAVBAR
        return true
      }
    }
    return false
  }
}
