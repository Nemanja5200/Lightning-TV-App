import Lightning from '@lightningjs/sdk/src/Lightning'
import { Utils } from '@lightningjs/sdk'
import { CardItem, HorizontalContainer, NavBar, VerticalContainer } from '../components'
import { ELEMENTS } from '../utils/Elements'
import { Widget } from './components'
import { tmdbService } from '../service/tmbdService'

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
      Widget: {
        type: Widget,
        x: 1415,
        y: 122,
      },
    }
  }

  async _init() {
    try {
      const moviesData = await tmdbService.getNowPlayingMovies()
      const data = moviesData.results.slice(0, 5).map((movie) => ({
        title: movie.title,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      }))

      console.log(data)

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
            titleFontFace: 'Inter-Bold',
            titleFontSize: 24,
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
            titleFontFace: 'Inter-Bold',
            titleFontSize: 24,
          },
        },
      ]

      this.tag(ELEMENTS.WRAPPER).patch({
        props: {
          items: rows,
        },
      })
    } catch (error) {
      console.error('Failed to fetch movies:', error)
      // Optionally show error UI or use fallback data
    }
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
    } else if (this._focusedComponent === ELEMENTS.WIDGET) {
      return this.tag(ELEMENTS.WIDGET)
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
    } else if (this._focusedComponent === ELEMENTS.WIDGET) {
      this._focusedComponent = ELEMENTS.WRAPPER
      return true
    }
    return false
  }

  _handleRight() {
    if (this._focusedComponent === ELEMENTS.WRAPPER) {
      const wrapper = this.tag(ELEMENTS.WRAPPER)
      const currentRow = wrapper.Items.children[wrapper._focusedIndex]

      if (currentRow && currentRow._focusedIndex === currentRow._props.items.length - 1) {
        this._focusedComponent = ELEMENTS.WIDGET
        return true
      }
      return false
    }
    return false
  }

  _handleLeft() {
    if (this._focusedComponent === ELEMENTS.WIDGET) {
      this._focusedComponent = ELEMENTS.WRAPPER
      return true
    }
    return false
  }
}
