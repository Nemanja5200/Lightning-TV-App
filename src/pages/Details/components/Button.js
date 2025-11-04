import Lightning from '@lightningjs/sdk/src/Lightning'
import { ELEMENTS } from '../../../constance/Elements'
import { COLORS } from '../../../constance/Colors'

export default class Button extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 30,
      },
      Wrapper: {
        flex: {
          direction: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        Icon: {
          w: 24,
          h: 24,
        },
        Label: {
          text: {
            text: '',
            fontSize: 17,
            fontFace: 'Inter-Bold',
            textColor: COLORS.WHITE,
            letterSpacing: 2,
            paddingLeft: 5,
          },
        },
      },
    }
  }

  get _Icon() {
    return this.tag(ELEMENTS.ICON)
  }

  _init() {
    this._unfocusedColor = COLORS.BUTTON_UNFOCUSED
    this._focusedColor = COLORS.RED
  }

  set props(config) {
    const {
      label = '',
      icon = null,
      unfocusedColor = COLORS.BUTTON_UNFOCUSED,
      focusedColor = COLORS.RED,
    } = config

    this._unfocusedColor = unfocusedColor
    this._focusedColor = focusedColor

    this.patch({
      color: unfocusedColor,
      Wrapper: {
        Label: {
          text: {
            text: label,
          },
        },
      },
    })

    if (icon) {
      this.tag(ELEMENTS.ICON).patch({
        src: icon,
      })
    } else {
      this.tag(ELEMENTS.ICON).visible = false
    }
  }

  _focus() {
    this.patch({
      smooth: { color: this._focusedColor, scale: 1.05 },
    })
  }

  _unfocus() {
    this.patch({
      smooth: { color: this._unfocusedColor, scale: 1 },
    })
  }
}
