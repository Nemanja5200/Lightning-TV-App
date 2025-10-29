import { Lightning } from '@lightningjs/sdk'
import Home from './pages/Home'

export default class App extends Lightning.Component {
  static _template() {
    return {
      Home: { type: Home },
    }
  }

  _init() {
    this.tag('Home').background = {
      image: 'images/background.png',
      zIndex: -1,
    }
  }

  _getFocused() {
    return this.tag('Home')
  }
}
