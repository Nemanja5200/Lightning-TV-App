import { Router, Utils } from '@lightningjs/sdk'
import routes from './lib/Routes'

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
    }
  }

  _setup() {
    Router.startRouter(routes, this)
  }

  _getFocused() {
    return Router.getActivePage()
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
