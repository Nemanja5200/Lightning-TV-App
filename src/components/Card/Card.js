import { Router, Utils } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { Marquee } from '@lightningjs/ui-components'
import { COLORS } from '../../constance/Colors'
import { PATHS } from '../../constance/paths'
import { ELEMENTS } from '../../constance/Elements'

export default class CardItem extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      color: COLORS.TRANSPARENT,
      flexItem: {
        marginRight: 24,
      },
      flex: {
        direction: 'column',
      },
      Image: {
        w: (w) => w,
        h: (h) => h - 49,
      },
      Label: {
        y: 0,
        w: 241,
        h: 49,
        type: Marquee,
        autoStart: false,
        repeat: -1,
        delay: 1,
        duration: 5,
        clipping: true,
        fixed: true,
        style: {
          textStyle: {
            fontSize: 24,
            textColor: COLORS.GRAY,
            fontFace: 'Inter-Regular',
          },
        },
      },
    }
  }

  _init() {
    this._focusState = false
  }

  set item(data) {
    this._item = data
    const imageSrc = data.image.startsWith('http') ? data.image : Utils.asset(data.image)
    this.patch({
      Image: { src: imageSrc },
      Label: {
        title: {
          text: data.title,
        },
      },
    })
  }

  _focus() {
    this._focusState = true
    this.tag(ELEMENTS.IMAGE).shader = {
      type: Lightning.shaders.RoundedRectangle,
      radius: 6,
      stroke: 6,
      strokeColor: 0xffff0000,
    }

    this.tag(ELEMENTS.IMAGE).patch({
      smooth: { scale: 1.05 },
    })

    this.tag(ELEMENTS.LABEL).patch({
      style: {
        textStyle: {
          textColor: COLORS.WHITE,
        },
      },
    })
    // Start marquee scrolling
    this.tag(ELEMENTS.LABEL).startScrolling()
  }

  _unfocus() {
    this._focusState = false

    this.tag(ELEMENTS.IMAGE).shader = {
      type: Lightning.shaders.RoundedRectangle,
      radius: 6,
      stroke: 0,
      strokeColor: 0x00000000,
    }

    this.tag(ELEMENTS.IMAGE).patch({
      smooth: { scale: 1.0 },
    })
    this.tag(ELEMENTS.LABEL).patch({
      style: {
        textStyle: {
          textColor: COLORS.GRAY,
        },
      },
    })
    // Stop marquee scrolling
    this.tag(ELEMENTS.LABEL).stopScrolling()
  }

  _handleEnter() {
    Router.navigate(`${PATHS.DETAILS}/${this._item.mediaType}/${this._item.id}`)
    return true
  }
}
