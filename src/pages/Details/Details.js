import Lightning from '@lightningjs/sdk/src/Lightning'
import { COLORS } from '../../constance/Colors'
import Button from './components/Button'
import { ELEMENTS } from '../../constance/Elements'
import { Router, Utils } from '@lightningjs/sdk'
import { IMAGE_PATH } from '../../constance/Images'

export default class Details extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: COLORS.BACKGROUND,
      },
      Content: {
        w: 1083,
        h: 700,
        y: 65,
        x: 69,
        BackButton: {
          type: Button,
        },
        MetaInfo: {
          y: 108,
          text: {
            text: 'Drama\n98 Minutes\nUS - 1987 - PG - IMDb: 7.7',
            fontFace: 'Inter-Regular',
            fontSize: 20,
            textColor: COLORS.WHITE,
            lineHeight: 28,
          },
        },
        MovieContent: {
          y: 200,
          w: 1083,
          h: 485,
          flex: { direction: 'row' },
          Poster: {
            flexItem: { marginRight: 40 },
            w: 325,
            h: 485,
            src: Utils.asset(IMAGE_PATH.DETAILS_POSTER),
          },
          Details: {
            w: 698,
            h: 485,
            flex: { direction: 'column' },
            flexItem: { marginTop: 30 },
            Title: {
              flexItem: { marginBottom: 20 },
              text: {
                text: 'Empire Of The Sun',
                fontFace: 'Inter-Bold',
                fontSize: 28,
                textColor: COLORS.WHITE,
              },
            },
            Paragraph: {
              flexItem: { marginBottom: 20 },
              text: {
                text: 'Boolean union variant background text vertical rectangle background horizontal. Boolean union variant background text vertical rectangle background horizontal. Pen export mask font image ellipse',
                fontFace: 'Inter-Bold',
                fontSize: 22,
                textColor: COLORS.WHITE,
                lineHeight: 31,
                wordWrap: true,
                wordWrapWidth: 698,
                maxLines: 4,
              },
            },
            Castinfo: {
              flex: { direction: 'column' },
              flexItem: { marginBottom: 60 },
              DirectorContainer: {
                flexItem: { marginBottom: 12 },
                flex: { direction: 'row' },
                Label: {
                  flexItem: { marginRight: 8 },
                  text: {
                    text: 'Director:',
                    fontFace: 'Inter-Bold',
                    fontSize: 18,
                    textColor: COLORS.WHITE,
                  },
                },
                Value: {
                  text: {
                    text: 'Enzo G. Castellari',
                    fontFace: 'Inter-Regular',
                    fontSize: 18,
                    textColor: COLORS.WHITE,
                  },
                },
              },
              CastContainer: {
                flex: { direction: 'row' },
                Label: {
                  flexItem: { marginRight: 8 },
                  text: {
                    text: 'Cast:',
                    fontFace: 'Inter-Bold',
                    fontSize: 18,
                    textColor: COLORS.WHITE,
                  },
                },
                Value: {
                  text: {
                    text: 'Enzo G. Castellari, Enzo G. Castellari, Enzo G. Castellari',
                    fontFace: 'Inter-Regular',
                    fontSize: 18,
                    textColor: COLORS.WHITE,
                    wordWrap: true,
                    wordWrapWidth: 650,
                  },
                },
              },
            },

            WatchNow: {
              type: Button,
            },
          },
        },
      },
    }
  }

  get BackButton() {
    return this.tag(ELEMENTS.BACK_BUTTON)
  }

  get MetaInfo() {
    return this.tag(ELEMENTS.META_INFO)
  }

  get WatchNow() {
    return this.tag(ELEMENTS.WHATCH_NOW)
  }

  set props(props) {
    this._detailsData = props

    const { parsedDetails, parsedCredits } = props
    if (!parsedDetails || !parsedCredits) return

    this.tag('Title').patch({
      text: { text: parsedDetails.title || 'N/A' },
    })

    this.tag('MetaInfo').patch({
      text: {
        text: `${parsedDetails.genre}\n${parsedDetails.duration}\n${parsedDetails.country} - ${parsedDetails.year} - IMDb: ${parsedDetails.rating}`,
      },
    })

    this.tag('Paragraph').patch({
      text: { text: parsedDetails.overview || 'No description available.' },
    })

    this.tag('DirectorContainer.Value').patch({
      text: { text: parsedCredits.director || 'Unknown' },
    })

    this.tag('CastContainer.Value').patch({
      text: { text: parsedCredits.cast || 'Unknown' },
    })

    if (parsedDetails.poster) {
      this.tag('Poster').patch({
        src: `https://image.tmdb.org/t/p/w500${parsedDetails.poster}`,
      })
    }
  }

  _init() {
    this.BackButton.patch({
      w: 112,
      h: 64,
      props: {
        icon: Utils.asset(IMAGE_PATH.BACK_ICON),
      },
      Wrapper: {
        w: 112,
        h: 64,
        Icon: {
          w: 35,
          h: 35,
        },
      },
    })

    this.WatchNow.patch({
      w: 286,
      h: 78,
      props: {
        label: 'WATCH NOW',
        icon: Utils.asset(IMAGE_PATH.WATCH_NOW),
      },
      Wrapper: {
        w: (w) => w,
        h: (h) => h,
        Icon: {
          w: 16,
          h: 16,
        },
        Label: {
          flexItem: { marginLeft: 13 },
        },
      },
    })
    this._setState(ELEMENTS.WHATCH_NOW)
  }

  static _states() {
    return [
      class WatchNow extends this {
        _getFocused() {
          return this.WatchNow
        }

        _handleUp() {
          this._setState(ELEMENTS.BACK_BUTTON)
          return true
        }
      },
      class BackButton extends this {
        _getFocused() {
          return this.BackButton
        }
        _handleDown() {
          this._setState(ELEMENTS.WHATCH_NOW)
          return true
        }
        _handleEnter() {
          Router.back()
          return true
        }
      },
    ]
  }
}
