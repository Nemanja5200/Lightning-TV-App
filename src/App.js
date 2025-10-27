import { Lightning, Utils } from '@lightningjs/sdk'
import MenuRow from './components/MenuRow/MenuRow'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      MenuRow: {
        type: MenuRow,
      },
    }
  }

  _getFocused() {
    return this.tag('MenuRow')
  }
}
