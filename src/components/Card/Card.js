import { Router, Utils } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { TextBox } from '@lightningjs/ui-components'
import { COLORS } from '../../constance/Colors'
import { PATHS } from '../../constance/paths'
import { ELEMENTS } from '../../constance/Elements'

export default class CardItem extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 241,
      h: 359,
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
        type: TextBox,
        w: 241,
        h: 49,
        fixed: true,
        marquee: true,
        clipping: true,
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

  set item(data) {
    this._item = data
    const imageSrc = data.image.startsWith('http') ? data.image : Utils.asset(data.image)
    this.patch({
      Image: { src: imageSrc },
      Label: {
        content: data.title,
      },
    })
  }

  _focus() {
    this.tag(ELEMENTS.IMAGE).shader = {
      type: Lightning.shaders.RoundedRectangle,
      radius: 6,
      stroke: 6,
      strokeColor: 0xffff0000,
    }
    this.tag(ELEMENTS.LABEL).patch({
      style: {
        textStyle: {
          textColor: COLORS.WHITE,
        },
      },
    })
  }

  _unfocus() {
    this.tag(ELEMENTS.IMAGE).shader = {
      type: Lightning.shaders.RoundedRectangle,
      radius: 6,
      stroke: 0,
      strokeColor: 0x00000000,
    }
    this.tag(ELEMENTS.LABEL).patch({
      style: {
        textStyle: {
          textColor: COLORS.GRAY,
        },
      },
    })
  }

  _handleEnter() {
    Router.navigate(`${PATHS.DETAILS}/${this._item.mediaType}/${this._item.id}`)
    return true
  }
}
