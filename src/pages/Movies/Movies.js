import { Lightning, Utils } from '@lightningjs/sdk'
import { COLORS } from '../../constance/Colors'
import { IMAGE_PATH } from '../../constance/Images'

export default class Movies extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: COLORS.BACKGROUND,
        zIndex: 1,
      },
      Content: {
        Hero: {
          w: 1920,
          h: 697,
          zIndex: 2,
          texture: {
            type: Lightning.textures.ImageTexture,
            src: Utils.asset(IMAGE_PATH.HERO_SECTION),
            resizeMode: {
              type: 'cover',
              w: 1920,
              h: 697,
              clipY: 0.5,
            },
          },
          Gradient: {
            w: 1920 / 4,
            h: 697,
            zIndex: 3,
            rect: true,
            color: 0xff151515,
          },
          Gradient1: {
            w: 1920 / 3,
            h: 697,
            zIndex: 3,
            x: 1920 / 4,
            rect: true,
            colorLeft: 0xff151515,
            colorRight: 0xcc151515,
          },
          Gradient2: {
            w: 1920,
            h: 697,
            x: 1920 / 3 + 1920 / 4,
            zIndex: 4,
            rect: true,
            colorLeft: 0xcc151515,
            colorRight: 0x00151515,
          },
        },
      },
    }
  }
}
