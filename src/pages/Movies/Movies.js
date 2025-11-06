import { Lightning, Router, Utils } from '@lightningjs/sdk'
import { COLORS } from '../../constance/Colors'
import { IMAGE_PATH } from '../../constance/Images'
import { HorizontalContainer } from '../../components'
import { ELEMENTS } from '../../constance/Elements'
import { HorCard } from '../../components/Card'

export default class Movies extends Lightning.Component {
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
                text: 'Empire of the Sun',
                fontFace: 'Inter-Bold',
                fontSize: 28,
                textColor: COLORS.WHITE,
              },
            },
            Info: {
              text: {
                text: 'Boolean union variant background text vertical rectangle background horizontal. Boolean union variant background text vertical rectangle background horizontal. Pen export mask font image ellipse ',
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
          },
        },
      },
    }
  }

  get MoviesContainer() {
    return this.tag('MoviesContainer')
  }

  _init() {
    const data = Array.from({ length: 10 }, (_, i) => ({
      title: `Movie ${i + 1}`,
      image: Utils.asset(IMAGE_PATH.TEST_VCARD),
    }))

    const cards = data.map((movie) => ({
      type: HorCard,
      item: {
        title: movie.title,
        image: movie.image,
      },
    }))

    this.MoviesContainer.patch({
      props: {
        items: cards,
        disableScroll: false,
        w: 1700,
        h: 302,
      },
    })

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
