import { Lightning, Router } from '@lightningjs/sdk'
import { COLORS } from '../../constance/Colors'
import { ANCHORES } from '../../constance/Anchors'
import { NameToRoute } from '../../constance/paths'
import { ELEMENTS } from '../../constance/Elements'

export default class NavElement extends Lightning.Component {
  _isActive = false
  static _template() {
    return {
      h: 49,
      w: 100,
      collision: true,
      flexItem: { marginRight: 130 },
      Label: {
        text: {
          fontSize: 24,
          fontFace: 'Inter-Bold',
          textColor: COLORS.GRAY,
        },
      },
    }
  }

  get route() {
    return this._item?.route || this._item?.label?.toLowerCase()
  }

  set item(data) {
    this._item = data
    this.patch({
      Label: {
        text: { text: data.label },
      },
    })

    this.tag('Label').once('txLoaded', () => {
      this._labelWidth = this.tag('Label').renderWidth
      this._labelReady = true
      if (this._isFocused) {
        this._applyFocus()
      }

      if (this._isActive) {
        this._updateColor()
      }
    })
  }

  get isActive() {
    return this._isActive
  }

  set isActive(isActive) {
    this._isActive = isActive
    this._updateColor()
  }

  _updateColor() {
    this.patch({
      Label: {
        text: {
          textColor: this._isFocused || this._isActive ? COLORS.WHITE : COLORS.GRAY,
        },
      },
    })
  }

  _focus() {
    this._isFocused = true
    if (this._labelReady) {
      this._applyFocus()
    }
  }

  _unfocus() {
    this._isFocused = false
    if (!this._isActive) {
      this.patch({
        Label: { text: { textColor: COLORS.GRAY } },
      })
    }
    this.patch({
      Underline: undefined,
    })
  }

  _applyFocus() {
    const extraPadding = 20
    this.patch({
      Label: { text: { textColor: COLORS.WHITE } },
      Underline: {
        x: -extraPadding,
        y: 38,
        w: this._labelWidth + extraPadding * 2,
        h: 4,
        rect: true,
        color: COLORS.RED,
      },
    })

    this._updateColor()
  }

  _handleEnter() {
    this.fireAncestors('$navItemActivated', this.route)
    this.fireAncestors(ANCHORES.NAV_SELECT_ITEM, this._item.label)
  }

  _handleHover() {
    console.log('NavBar')
    this._focus()
    this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this))
    Router.focusWidget(ELEMENTS.NAVBAR)
  }

  _handleClick() {
    this._handleEnter()
  }

  _handleUnhover() {
    Router.focusPage()
  }
}
