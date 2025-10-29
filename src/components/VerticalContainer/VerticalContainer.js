import { Lightning } from '@lightningjs/sdk'

export default class VerticalContainer extends Lightning.Component {
  _props = {
    items: [],
    title: '',
    enableScroll: false,
  }
  _focusedIndex = 0
  _scrollPosition = 0

  static _template() {
    return {
      flex: { direction: 'column' },
      Title: {
        visible: false,
      },
      Items: {
        flex: { direction: 'column' },
      },
    }
  }

  get Items() {
    return this.tag('Items')
  }

  get Title() {
    return this.tag('Title')
  }

  set props(props) {
    const { items, title, w, h, ...rest } = props
    this._props = { ...this._props, ...rest }

    if (w) this.patch({ w })
    if (h) this.patch({ h })

    if (title && title !== '') {
      this.Title.patch({
        visible: true,
        flexItem: { marginBottom: 20 },
        text: {
          text: title,
          fontSize: 40,
          fontFace: 'Montserrat-Medium',
          textColor: 0xffffffff,
        },
      })
    } else {
      this.Title.patch({ visible: false })
    }

    if (items && items !== this._props.items) {
      this._props.items = items
      this.Items.childList.clear()

      if (items.length > 0) {
        this.Items.childList.a(items)
        this._focusedIndex = 0
      } else {
        this._focusedIndex = -1
      }

      this._scrollPosition = 0
      this.Items.patch({ y: 0 })
    }

    this.stage.update()
  }

  _getFocused() {
    return this.Items?.children?.[this._focusedIndex]
  }

  _reCalibrateScroll() {
    if (!this._props.enableScroll || !this.h) return

    this.stage.update()

    const currentFocus = this.Items.children[this._focusedIndex]
    if (!currentFocus) return

    const containerHeight = this.finalH
    const itemY = currentFocus.finalY
    const itemH = currentFocus.finalH

    const itemBottom = itemY + itemH + this.Items.y
    const itemTop = itemY + this.Items.y

    if (itemBottom > containerHeight) {
      this._scrollPosition -= itemBottom - containerHeight + 20
      this.Items.smooth = { y: this._scrollPosition }
    } else if (itemTop < 0) {
      this._scrollPosition -= itemTop - 20
      this.Items.smooth = { y: this._scrollPosition }
    }
  }

  _handleDown() {
    const { items } = this._props
    if (this._focusedIndex < items.length - 1) {
      this.Items.children[this._focusedIndex]?._unfocus()
      this._focusedIndex += 1
      this.Items.children[this._focusedIndex]?._focus()
      this._reCalibrateScroll()
      return true
    }
    return false
  }

  _handleUp() {
    if (this._focusedIndex > 0) {
      this.Items.children[this._focusedIndex]?._unfocus()
      this._focusedIndex -= 1
      this.Items.children[this._focusedIndex]?._focus()
      this._reCalibrateScroll()
      return true
    }
    return false
  }

  _handleLeft() {
    return false
  }

  _handleRight() {
    return false
  }

  _focus() {
    const { items } = this._props
    if (this._focusedIndex >= 0 && this._focusedIndex < items.length) {
      this.Items.children[this._focusedIndex]?._focus()
    }
  }

  _unfocus() {
    const { items } = this._props
    if (this._focusedIndex >= 0 && this._focusedIndex < items.length) {
      this.Items.children[this._focusedIndex]?._unfocus()
    }
  }

  _appendItems(items) {
    items?.forEach((item) => {
      this._props.items.push(item)
      this.Items.childList.a(item)
    })
    this.stage.update()
  }

  _clear() {
    this._props.items = []
    this.Items.childList.clear()
    this._focusedIndex = 0
    this._scrollPosition = 0
    this.Items.y = 0
    this.stage.update()
  }
}
