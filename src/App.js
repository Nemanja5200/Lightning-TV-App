import { Router, Utils } from '@lightningjs/sdk'
import routes from './lib/Routes'
import { NavBar } from './components'
import { ELEMENTS } from './utils/Elements'

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

  $navItemSelected(label) {
    console.log('Navigating to:', label)

    const routeMap = {
      Home: 'home',
      Movies: 'movies',
    }

    const route = routeMap[label]
    if (route) {
      Router.navigate(route)
    }
  }
}
