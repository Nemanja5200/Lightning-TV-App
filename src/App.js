import { Colors, Router, Utils } from '@lightningjs/sdk'
import routes from './lib/Routes'
import { LoadingScreenComponent, NavBar } from './components'
import { ELEMENTS } from './constance/Elements'
import { NameToRoute } from './constance/paths'
import '@lightningjs/core/inspector'

export default class App extends Router.App {
  static getFonts() {
    return [
      { family: 'Inter-Regular', url: Utils.asset('fonts/Inter-Regular.ttf') },
      { family: 'Inter-Bold', url: Utils.asset('fonts/Inter-Bold.ttf') },
    ]
  }

  static _template() {
    return {
      ...super._template(),
      Pages: {
        collision: true,
        w: 1920,
        h: 1080,
      },
      Loading: {
        type: LoadingScreenComponent,
        rect: true,
        w: 1920,
        h: 1080,
        zIndex: 102,
        color: Colors('#000000').get(),
        visible: true,
        props: {
          xPos: 960,
          yPos: 540,
        },
      },
      Widgets: {
        NavBar: {
          type: NavBar,
          zIndex: 3,
        },
      },
    }
  }

  _setup() {
    Router.startRouter(routes, this)
  }

  get _NavBar() {
    return this.tag(ELEMENTS.NAVBAR)
  }

  $showLoading() {
    this.tag('Loading').visible = true
  }

  $hideLoading() {
    this.tag('Loading').visible = false
  }

  $navItemSelected(label) {
    const route = NameToRoute[label]
    if (route) {
      Router.navigate(route)
    }
  }
}
