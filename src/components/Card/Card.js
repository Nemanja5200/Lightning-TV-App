import { Router, Utils } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { COLORS } from '../../constance/Colors'
import { PATHS } from '../../constance/paths'
import { ELEMENTS } from '../../constance/Elements'

export default class CardItem extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 241,
      h: 359,
      text: {
        fontSize: 24,
        fontFace: 'Inter-Regular',
      },
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
        color: COLORS.GRAY,
        text: {
          fontSize: 28,
        },
      },
    }
  }

  set item(data) {
    this._item = data

    const imageSrc = data.image.startsWith('http') ? data.image : Utils.asset(data.image)

    this.patch({
      Image: { src: imageSrc },
      Label: { text: { text: data.title } },
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
      color: COLORS.WHITE,
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
      color: COLORS.GRAY,
    })
  }

  _handleEnter() {
    Router.navigate(`${PATHS.DETAILS}/${this._item.mediaType}/${this._item.id}`)
    return true
  }
}
