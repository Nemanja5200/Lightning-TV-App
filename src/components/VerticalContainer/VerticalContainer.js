import { Lightning } from '@lightningjs/sdk'

export default class VerticalContainer extends Lightning.Component {
  _props = {
    items: [],
    title: '',
    enableScroll: false,
    scrollMargin: 20,
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
    const {
      items,
      title,
      w,
      h,
      titleFontSize,
      titleFontFace,
      titleColor,
      titleMarginBottom,
      titleMarginTop,
      titleAlign,
      scrollMargin,
      ...rest
    } = props

    this._props = { ...this._props, ...rest }

    if (scrollMargin !== undefined) {
      this._props.scrollMargin = scrollMargin
    }

    if (w) this.patch({ w })
    if (h) this.patch({ h })

    // naslov
    if (title && title !== '') {
      const alignment = titleAlign || 'left'
      const marginBottom = titleMarginBottom !== undefined ? titleMarginBottom : 20
      const marginTop = titleMarginTop !== undefined ? titleMarginTop : 0

      this.Title.patch({
        visible: true,
        flexItem: {
          marginBottom: marginBottom,
          marginTop: marginTop,
        },
        text: {
          text: title,
          fontSize: titleFontSize || 40,
          fontFace: titleFontFace || 'Montserrat-Medium',
          textColor: titleColor || 0xffffffff,
        },
      })

      if (alignment === 'center' && w) {
        this.Title.patch({
          mount: 0.5,
          x: w / 2,
        })
      } else if (alignment === 'right' && w) {
        this.Title.patch({
          mount: 1,
          x: w,
        })
      } else {
        this.Title.patch({
          mount: 0,
          x: 0,
        })
      }
    } else {
      this.Title.patch({ visible: false })
    }

    // dodavanje itema
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
    const margin = this._props.scrollMargin

    const itemBottom = itemY + itemH + this.Items.y
    const itemTop = itemY + this.Items.y

    if (itemBottom > containerHeight) {
      this._scrollPosition -= itemBottom - containerHeight + margin
      this.Items.smooth = { y: this._scrollPosition }
    } else if (itemTop < 0) {
      this._scrollPosition -= itemTop - margin
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
    this.Items.children[this._focusedIndex]?._unfocus()
  }

  $handleItemHover(index) {
    if (this._focusedIndex !== index) {
      this.Items.children[this._focusedIndex]?._unfocus()
      this._focusedIndex = index
    }
    this._reCalibrateScroll()

    // pošalji svoje ime (MoviesRow ili SeriesRow)
    console.log(this.ref)
    this.fireAncestors('$handleHoverState', this.ref)
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
