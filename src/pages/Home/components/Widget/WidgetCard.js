import Lightning from '@lightningjs/sdk/src/Lightning'
import { COLORS } from '../../../../constance/Colors'

export default class WidgetCard extends Lightning.Component {
  static _template() {
    return {
      h: 136,
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
          titleFontFace: 'Inter-Regular',
          titleColor: COLORS.WHITE,
        },
      },
    }
  }

  get Logo() {
    return this.tag('Logo')
  }

  get Title() {
    return this.tag('Title')
  }

  set item(data) {
    this._item = data
    this.patch({
      Logo: {
        src: data.logo,
      },
      Title: {
        text: {
          text: data.title,
        },
      },
    })
  }

  _focus() {
    this.patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 12,
        stroke: 4,
        strokeColor: COLORS.RED,
      },
    })
  }

  _unfocus() {
    this.patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 12,
        stroke: 0,
      },
    })
  }
}
