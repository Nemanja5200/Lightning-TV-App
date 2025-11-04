import { Lightning } from '@lightningjs/sdk'
import { COLORS } from '../../constance/Colors'

export default class Movies extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: COLORS.BACKGROUND,
      },
      Content: {
        Label: {
          x: 900,
          y: 500,
          color: COLORS.GRAY,
          text: {
            text: 'Movies Page',
            fontSize: 28,
          },
        },
      },
    }
  }
}
