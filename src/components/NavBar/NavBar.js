import Lightning from '@lightningjs/sdk/src/Lightning'
import HorizontalContainer from '../HorizontalContainer/HorizontalContainer'
import { Router, Utils } from '@lightningjs/sdk'
import NavElement from './NavElement.js'

export default class Navbar extends Lightning.Component {
  static _template() {
    return {
      w: 1841,
      h: 60,
      x: 32,
      y: 32,
      flex: {
        direction: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      Logo: {
        w: 301,
        h: 44,
        src: Utils.asset('images/Logo.png'),
      },
      NavItems: {
        type: HorizontalContainer,
        x: 80,
        w: 674,
        h: 49,
        flexItem: { marginTop: 10 },
      },
    }
  }

  get NavItems() {
    return this.tag('NavItems')
  }
  _active() {
    this._updateActiveNav()
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
  _handleRight() {
    return true
  }
  _handleLeft() {
    return true
  }

  _onActivated(page) {
    this._updateActiveNav()
  }

  _updateActiveNav() {
    setTimeout(() => {
      const activeRoute = Router.getActiveHash()
      const navItems = this.tag('NavItems').tag('Items')?.children || []
      this._updateActiveFlags(navItems, activeRoute)
    }, 50)
  }

  $navItemActivated(route) {
    const navItems = this.tag('NavItems').tag('Items')?.children || []
    this._updateActiveFlags(navItems, route)
  }

  _updateActiveFlags(navItems, route) {
    navItems.forEach((item) => {
      if (item.route === route) {
        item.isActive = true
      } else {
        item.isActive = false
      }
    })
  }
}
