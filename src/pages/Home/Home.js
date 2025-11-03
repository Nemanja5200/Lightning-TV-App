import Lightning from '@lightningjs/sdk/src/Lightning'
import { Router, Utils } from '@lightningjs/sdk'
import { Widget } from '../components'
import { fetchHomeData } from '../../service/fetchHomeData'
import { HorizontalContainer } from '../../components'
import { ELEMENTS } from '../../utils/Elements'

export default class Home extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      Background: {
        w: 1920,
        h: 1080,
        zIndex: -1,
      },
      Content: {
        x: 64,
        y: 125,
        w: 1241,
        Movies: {
          type: HorizontalContainer,
          w: 1241,
          h: 464,
          props: {
            railTitle: 'Movies',
            h: 359,
            titleFontFace: 'Inter-Bold',
            titleFontSize: 24,
          },
        },
        Series: {
          type: HorizontalContainer,
          w: 1241,
          h: 464,
          y: 430,
          props: {
            railTitle: 'Series',
            h: 359,
            titleFontFace: 'Inter-Bold',
            titleFontSize: 24,
          },
        },
      },
      Widget: {
        type: Widget,
        x: 1415,
        y: 122,
      },
    }
  }

  async _init() {
    this.tag('Background').patch({
      src: Utils.asset('images/background.png'),
    })
    const rows = await fetchHomeData()
    this.tag(ELEMENTS.MOVIES).patch({
      props: {
        items: rows.cardMovieItems,
      },
    })
    this.tag(ELEMENTS.SERIES).patch({
      props: {
        items: rows.cardSeriesItems,
      },
    })
    this._setState(ELEMENTS.MOVIES)
  }

  _active() {
    this._setState(ELEMENTS.MOVIES)
  }

  set background(data) {
    this.tag('Background').patch({
      src: Utils.asset(data.image),
      zIndex: data.zIndex ?? -100,
    })
  }

  static _states() {
    return [
      class Movies extends this {
        $enter() {
          this._refocus()
        }
        _getFocused() {
          return this.tag(ELEMENTS.MOVIES)
        }

        _handleDown() {
          this._setState(ELEMENTS.SERIES)
          return true
        }

        _handleUp() {
          Router.focusWidget(ELEMENTS.NAVBAR)
          return true
        }

        _handleRight() {
          const movies = this.tag(ELEMENTS.MOVIES)
          if (movies._focusedIndex === movies._props.items.length - 1) {
            this._setState(ELEMENTS.WIDGET)
            return true
          }
          return false
        }
      },

      class Series extends this {
        _getFocused() {
          return this.tag(ELEMENTS.SERIES)
        }

        _handleUp() {
          this._setState(ELEMENTS.MOVIES)
          return true
        }

        _handleRight() {
          const series = this.tag(ELEMENTS.SERIES)
          if (series._focusedIndex === series._props.items.length - 1) {
            this._setState(ELEMENTS.WIDGET)
            return true
          }
          return false
        }
      },

      class Widget extends this {
        _getFocused() {
          return this.tag(ELEMENTS.WIDGET)
        }

        _handleLeft() {
          this._setState(ELEMENTS.MOVIES)
          return true
        }
      },
    ]
  }
}
