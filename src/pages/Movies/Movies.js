import { Lightning, Router, Utils } from '@lightningjs/sdk'
import { COLORS } from '../../constance/Colors'
import { IMAGE_PATH } from '../../constance/Images'
import { HorizontalContainer } from '../../components'
import { ELEMENTS } from '../../constance/Elements'
import { TMBD_ROUTE } from '../../constance/constance'

export default class Movies extends Lightning.Component {
  _updateTimeout = null
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: COLORS.BACKGROUND,
        zIndex: 1,
      },
      Content: {
        Hero: {
          w: 1920,
          h: 697,
          zIndex: 2,
          texture: {
            type: Lightning.textures.ImageTexture,
            src: Utils.asset(IMAGE_PATH.HERO_SECTION),
            resizeMode: {
              type: 'cover',
              w: 1920,
              h: 697,
              clipY: 0.5,
            },
          },
          Gradient: {
            w: 1920 / 4,
            h: 697,
            zIndex: 3,
            rect: true,
            color: 0xff151515,
          },
          Gradient1: {
            w: 1920 / 3,
            h: 697,
            zIndex: 3,
            x: 1920 / 4,
            rect: true,
            colorLeft: 0xff151515,
            colorRight: 0xcc151515,
          },
          Gradient2: {
            w: 1920,
            h: 697,
            x: 1920 / 3 + 1920 / 4,
            zIndex: 4,
            rect: true,
            colorLeft: 0xcc151515,
            colorRight: 0x00151515,
          },
          MovieInfo: {
            w: 698,
            h: 162,
            y: 258,
            x: 69,
            zIndex: 5,
            flex: { direction: 'column' },
            Title: {
              flexItem: { marginBottom: 40 },
              text: {
                fontFace: 'Inter-Bold',
                fontSize: 28,
                textColor: COLORS.WHITE,
              },
            },
            Info: {
              text: {
                fontFace: 'Inter-Regular',
                fontSize: 22,
                textColor: COLORS.WHITE,
                wordWrap: true,
                wordWrapWidth: 698,
                lineHeight: 31,
              },
            },
          },
          MoviesContainer: {
            y: 697,
            x: 45,
            zIndex: 5,
            type: HorizontalContainer,
            signals: {
              horizontalContainerIndexChange: '_horizontalContainerIndexChange',
            },
          },
        },
      },
    }
  }

  get MoviesContainer() {
    return this.tag('MoviesContainer')
  }

  get _focusedMovieIndex() {
    return this._MoviesContainer_?._focusedIndex ?? 0
  }

  set props(props) {
    this._props = props
    const movie = props.movieInfo[0]
    this.patch({
      Content: {
        Hero: {
          texture: {
            // Change this
            type: Lightning.textures.ImageTexture,
            src: `${TMBD_ROUTE.IMAGE_W1280}${movie.image[0]}`,
            resizeMode: {
              type: 'cover',
              w: 1920,
              h: 697,
              clipY: 0.5,
            },
          },
          MoviesContainer: {
            props: {
              items: props.cardMovieItems,
              disableScroll: false,
              w: 1700,
              h: 302,
            },
          },
          MovieInfo: {
            Title: {
              text: { text: movie.title },
            },
            Info: {
              text: { text: movie.overview },
            },
          },
        },
      },
      Background: {
        color: props.bgColor || 0xff000000,
      },
    })
  }

  _horizontalContainerIndexChange(newIndex) {
    if (this._updateTimeout) {
      clearTimeout(this._updateTimeout)
    }

    this._updateTimeout = setTimeout(() => {
      const movie = this._props.movieInfo?.[newIndex]
      if (!movie) return

      const hero = this.tag('Hero')
      const movieInfo = this.tag('MovieInfo')

      hero.setSmooth('alpha', 0.5, { duration: 0.2 })
      movieInfo.setSmooth('x', -100, { duration: 0.25 })
      movieInfo.setSmooth('alpha', 0, { duration: 0.2 })

      setTimeout(() => {
        this.patch({
          Content: {
            Hero: {
              texture: {
                type: Lightning.textures.ImageTexture,
                src: `${TMBD_ROUTE.IMAGE_W1280}${movie.image[0]}`,
                resizeMode: {
                  type: 'cover',
                  w: 1920,
                  h: 697,
                  clipY: 0.5,
                },
              },
              MovieInfo: {
                Title: { text: { text: movie.title } },
                Info: { text: { text: movie.overview } },
              },
            },
          },
        })

        hero.setSmooth('alpha', 1, { duration: 0.3 })
        movieInfo.setSmooth('x', 69, { duration: 0.3 })
        movieInfo.setSmooth('alpha', 1, { duration: 0.3 })
      }, 150)
    }, 150)

    this._preloadAdjacentImages(newIndex)
  }

  _init() {
    this._setState('MoviesContainer')
  }

  static _states() {
    return [
      class MoviesContainer extends this {
        _getFocused() {
          return this.MoviesContainer
        }
        _handleUp() {
          Router.focusWidget(ELEMENTS.NAVBAR)
          return true
        }
      },
    ]
  }
}
