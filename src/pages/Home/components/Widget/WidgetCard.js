import Lightning from '@lightningjs/sdk/src/Lightning'
import { COLORS } from '../../../../constance/Colors'

export default class WidgetCard extends Lightning.Component {
  static _template() {
    return {
      h: 136,
      flexItem: { marginBottom: 10 },
      FocusBox: {
        x: -4,
        y: -4,
        w: (w) => w + 8,
        h: 144,
        rect: true,
        color: COLORS.RED,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 12 },
        visible: false,
        rtt: true,
      },
      CardContent: {
        h: 136,
        w: (W) => W,
        rect: true,
        color: COLORS.WIDGETCARD,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 12 },
        flexItem: { marginBottom: 24 },
        flex: {
          direction: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        Logo: {
          w: 48,
          h: 48,
          flexItem: { marginBottom: 24 },
        },
        Title: {
          text: {
            fontSize: 16,
            fontFace: 'Inter-Regular',
            textColor: COLORS.WHITE,
          },
        },
      },
    }
  }

  get Logo() {
    return this.tag('CardContent.Logo')
  }

  get Title() {
    return this.tag('CardContent.Title')
  }

  set item(data) {
    this._item = data
    this.patch({
      CardContent: {
        Logo: {
          src: data.logo,
        },
        Title: {
          text: {
            text: data.title,
          },
        },
      },
    })
  }

  _focus() {
    this.tag('FocusBox').visible = true
  }

  _unfocus() {
    this.tag('FocusBox').visible = false
  }
}
