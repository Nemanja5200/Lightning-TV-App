import Lightning from '@lightningjs/sdk/src/Lightning'
import { ELEMENTS } from '../../../constance/Elements'
import { COLORS } from '../../../constance/Colors'

export default class Button extends Lightning.Component {
  static _template() {
    return {
      rect: true,

      collision: true,
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
    this._isFocused = false
    this._isHoverd = false
  }

  set props(config) {
    const {
      label = '',
      icon = null,
      unfocusedColor = COLORS.BUTTON_UNFOCUSED,
      focusedColor = COLORS.RED,
      buttonId = null,
    } = config

    this._unfocusedColor = unfocusedColor
    this._focusedColor = focusedColor
    this._buttonId = buttonId

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
  _handleHover() {
    this.fireAncestors('$buttonHovered', this.ref)
    return false
  }

  _handleClick() {
    this.fireAncestors('$buttonClicked', this.ref)
    return false
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

  _updateVisualState() {
    if (this._isFocused || this._isHoverd) {
      this.patch({
        smooth: {
          color: this._focusedColor,
          scale: this._isHoverd && this._isFocused ? 1.03 : 1.05,
        },
      })
    } else {
      this.patch({
        smooth: {
          color: this._unfocusedColor,
          scale: 1,
        },
      })
    }
  }
}
