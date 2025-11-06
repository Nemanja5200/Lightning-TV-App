import Lightning from '@lightningjs/sdk/src/Lightning'
import { Router, Utils } from '@lightningjs/sdk'
import { HorizontalContainer } from '../../components'
import { ELEMENTS } from '../../constance/Elements'
import { Widget } from './components'
import { ANCHORES } from '../../constance/Anchors'

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

  set props(props) {
    this._homeData = props
    if (this.tag(ELEMENTS.MOVIES)) {
      this.tag(ELEMENTS.MOVIES).patch({
        props: {
          items: props.cardMovieItems,
        },
      })
      this.tag(ELEMENTS.SERIES).patch({
        props: {
          items: props.cardSeriesItems,
        },
      })
    }
  }

  _init() {
    this.tag('Background').patch({
      src: Utils.asset('images/background.png'),
    })

    if (this._homeData) {
      this.tag(ELEMENTS.MOVIES).patch({
        props: {
          items: this._homeData.cardMovieItems,
        },
      })
      this.tag(ELEMENTS.SERIES).patch({
        props: {
          items: this._homeData.cardSeriesItems,
        },
      })
    }

    this._setState(ELEMENTS.MOVIES)
    Router.focusWidget(ELEMENTS.NAVBAR)
  }

  _active() {
    this.fireAncestors(ANCHORES.HIDE_LOADING)
  }

  set background(data) {
    this.tag('Background').patch({
      src: Utils.asset(data.image),
      zIndex: data.zIndex ?? -100,
    })
  }

  get _Movies() {
    return this.tag(ELEMENTS.MOVIES)
  }

  get _Series() {
    return this.tag(ELEMENTS.SERIES)
  }

  _handleBack(e) {
    if (Router.isNavigating()) {
      return
    }
    e.preventDefault()
  }

  static _states() {
    return [
      class Movies extends this {
        $enter() {
          this._dataLoaded = true
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
          this._setState(ELEMENTS.WIDGET)
          return true
        }
      },
      class Series extends this {
        $enter() {
          this._refocus()
        }
        _getFocused() {
          return this.tag(ELEMENTS.SERIES)
        }
        _handleUp() {
          this._setState(ELEMENTS.MOVIES)
          return true
        }
        _handleRight() {
          this._setState(ELEMENTS.WIDGET)
          return true
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
