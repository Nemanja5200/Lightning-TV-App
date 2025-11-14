import Lightning from '@lightningjs/sdk/src/Lightning'
import { COLORS } from '../../constance/Colors'
import Button from './components/Button'
import { ELEMENTS } from '../../constance/Elements'
import { Router, Utils } from '@lightningjs/sdk'
import { IMAGE_PATH } from '../../constance/Images'
import { TMBD_ROUTE } from '../../constance/constance'
import { PATHS } from '../../constance/paths'

export default class Details extends Lightning.Component {
  static _template() {
    return {
      zIndex: 1,
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
            text: '',
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
          },
          Details: {
            w: 698,
            h: 485,
            flex: { direction: 'column' },
            flexItem: { marginTop: 30 },
            Title: {
              flexItem: { marginBottom: 20 },
              text: {
                text: '',
                fontFace: 'Inter-Bold',
                fontSize: 28,
                textColor: COLORS.WHITE,
              },
            },
            Paragraph: {
              flexItem: { marginBottom: 20 },
              text: {
                text: '',
                fontFace: 'Inter-Regular',
                fontSize: 18,
                textColor: COLORS.WHITE,
                lineHeight: 26,
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
                    text: '',
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
                    text: '',
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
    return this.tag('Content.BackButton')
  }

  get MetaInfo() {
    return this.tag('Content.MetaInfo')
  }

  get WatchNow() {
    return this.tag('Content.MovieContent.Details.WatchNow')
  }

  set props(props) {
    this._detailsData = props

    const { parsedDetails, parsedCredits } = props
    if (!parsedDetails || !parsedCredits) return

    // Store data and update if template is ready
    if (this.tag('Content.MetaInfo')) {
      this._updateUI()
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

    if (this._detailsData) {
      this._updateUI()
    }

    this._setState(ELEMENTS.WHATCH_NOW)
  }

  _updateUI() {
    const { parsedDetails, parsedCredits } = this._detailsData

    this.tag('Content').patch({
      MetaInfo: {
        text: {
          text: `${parsedDetails.genre}\n${parsedDetails.duration}\n${parsedDetails.country} - ${parsedDetails.year} - IMDb: ${parsedDetails.rating}`,
        },
      },
      MovieContent: {
        Poster: parsedDetails.poster
          ? {
              src: `${TMBD_ROUTE.IMAGE_500}${parsedDetails.poster}`,
            }
          : {},
        Details: {
          Title: {
            text: { text: parsedDetails.title || 'N/A' },
          },
          Paragraph: {
            text: { text: parsedDetails.overview || 'No description available.' },
          },
          Castinfo: {
            DirectorContainer: {
              Value: {
                text: { text: parsedCredits.director || 'Unknown' },
              },
            },
            CastContainer: {
              Value: {
                text: { text: parsedCredits.cast || 'Unknown' },
              },
            },
          },
        },
      },
    })
  }

  static _states() {
    return [
      class WatchNow extends this {
        $enter() {
          this._refocus()
        }

        _getFocused() {
          return this.WatchNow
        }

        _handleUp() {
          this._setState(ELEMENTS.BACK_BUTTON)
          return true
        }

        _handleEnter() {
          Router.navigate(PATHS.PLAYER)
        }
      },
      class BackButton extends this {
        $enter() {
          this._refocus()
        }

        _getFocused() {
          return this.BackButton
        }

        _handleDown() {
          this._setState(ELEMENTS.WHATCH_NOW)
          return true
        }

        _handleEnter() {
          const history = Router.getHistory()

          if (history.length) {
            Router.back()
          } else {
            Router.navigate(PATHS.HOME)
          }
        }
      },
    ]
  }

  _handleBack() {
    const history = Router.getHistory()

    if (history.length) {
      Router.back()
    } else {
      Router.navigate(PATHS.HOME)
    }
  }
}
