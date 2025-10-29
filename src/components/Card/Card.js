import { Utils } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { TEXT_COLORS } from '../../utils/Colors'

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
      color: TEXT_COLORS.TRANSPARENT,
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
        color: TEXT_COLORS.GRAY,
        text: {
          fontSize: 28,
        },
      },
    }
  }

  set item(data) {
    this._item = data
    this.patch({
      Image: { src: Utils.asset(data.image) },
      Label: { text: { text: data.title } },
    })
  }

  _focus() {
    this.tag('Image').shader = {
      type: Lightning.shaders.RoundedRectangle,
      radius: 6,
      stroke: 6,
      strokeColor: 0xffff0000,
    }
    this.tag('Label').patch({
      color: TEXT_COLORS.WHITE,
    })
  }

  _unfocus() {
    this.tag('Image').shader = {
      type: Lightning.shaders.RoundedRectangle,
      radius: 6,
      stroke: 0,
      strokeColor: 0x00000000,
    }
    this.tag('Label').patch({
      color: TEXT_COLORS.GRAY,
    })
  }
}
