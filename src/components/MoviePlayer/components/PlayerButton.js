import { Colors, Utils } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { IMAGE_PATH } from '../../../constance/Images'

export default class PlayerButton extends Lightning.Component {
  static _template() {
    return {
      w: 86,
      h: 86,
      Ellipse: {
        w: (w) => w,
        h: (h) => h,
        Background: {
          w: (w) => w - 6,
          h: (h) => h - 6,
          x: (w) => w / 2,
          y: (h) => h / 2,
          mount: 0.5,
          rect: true,
          alpha: 0,
          color: 0xff000000,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 40,
          },
        },
        EllipseBorder: {
          w: (w) => w,
          h: (h) => h,
          src: Utils.asset(IMAGE_PATH.PLAYER_ELLIPSE),
          color: 0x4dffffff,
        },
        Icon: {
          w: 50,
          h: 50,
          x: (w) => w / 2,
          y: (h) => h / 2,
          mount: 0.5,
          color: 0x4dffffff,
        },
      },
    }
  }
  set icon(config) {
    this.tag('Icon').patch({
      src: config.src || config,
      w: config.width || 35,
      h: config.height || 35,
    })
  }

  _focus() {
    this.tag('Icon').setSmooth('color', 0xffed1c24, { duration: 0.3 })
    this.tag('Background').setSmooth('alpha', 0.7, { duration: 0.3 })
    this.tag('EllipseBorder').setSmooth('color', 0xffed1c24, { duration: 0.3 })
  }

  _unfocus() {
    this.tag('Icon').setSmooth('color', 0x4dffffff, { duration: 0.3 })
    this.tag('Background').setSmooth('alpha', 0, { duration: 0.3 })
    this.tag('EllipseBorder').setSmooth('color', 0x4dffffff, { duration: 0.3 })
  }
}
