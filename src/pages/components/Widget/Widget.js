import Lightning from '@lightningjs/sdk/src/Lightning'
import { COLORS } from '../../../utils/Colors'
import { VerticalContainer } from '../../../components'
import { Utils } from '@lightningjs/sdk'
import WidgetCard from './WidgetCard'
export default class Widget extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 312,
      h: 826,
      color: COLORS.BLACK,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 12,
      },
      flex: {
        direction: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      Title: {
        flexItem: { marginBottom: 24, marginTop: 35 },
        text: {
          text: 'Top 5 Channels',
          fontFace: 'Inter-Bold',
          fontSize: 28,
          textColor: COLORS.WHITE,
        },
      },
      WidgetCards: {
        type: VerticalContainer,
      },
    }
  }

  _init() {
    const CardData = Array.from({ length: 5 }).map((_, index) => ({
      title: `Channel ${index + 1}`,
      logo: Utils.asset('images/widget/ChannelLogo.png'),
    }))

    const cardItems = CardData.map((item) => ({
      type: WidgetCard,
      item,
    }))

    this.tag('WidgetCards').patch({
      props: {
        items: cardItems,
        w: 280,
        h: 'auto',
      },
    })
  }

  _getFocused() {
    return this.tag('WidgetCards')
  }
}
