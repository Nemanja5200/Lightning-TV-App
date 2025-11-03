import Lightning from '@lightningjs/sdk/src/Lightning'
import HorizontalContainer from '../HorizontalContainer/HorizontalContainer'
import { Router, Utils } from '@lightningjs/sdk'
import NavElement from './NavElement,js'

export default class Navbar extends Lightning.Component {
  static _template() {
    return {
      w: 1841,
      h: 60,
      x: 32,
      y: 32,
      flexItem: { marginRight: 10 },
      Logo: {
        w: 301,
        h: 44,
        src: Utils.asset('images/Logo.png'),
      },
      NavItems: {
        type: HorizontalContainer,
        x: 340,
        w: 674,
        h: 49,
        flex: { paddingLeft: 150 },
      },
    }
  }

  get NavItems() {
    return this.tag('NavItems')
  }

  _init() {
    const navData = [{ label: 'Home' }, { label: 'Movies' }]

    const navItems = navData.map((item) => ({
      type: NavElement,
      item,
    }))

    this.NavItems.patch({
      props: {
        items: navItems,
        h: 49,
        disableScroll: true,
      },
    })
  }

  _getFocused() {
    return this.NavItems
  }

  _handleDown() {
    Router.focusPage()
    return true
  }
}
