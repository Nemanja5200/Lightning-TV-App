import { Colors, Router, Utils } from '@lightningjs/sdk'
import routes from './lib/Routes'
import { LoadingScreenComponent, NavBar } from './components'
import { ELEMENTS } from './constance/Elements'
import { NameToRoute } from './constance/paths'
import '@lightningjs/core/inspector'
import { COLORS } from './constance/Colors'
import Lightning from '@lightningjs/sdk/src/Lightning'

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
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: COLORS.BACKGROUND,
      },
    }
  }

  _setup() {
    Router.startRouter(routes, this)
  }

  get _NavBar() {
    return this.tag(ELEMENTS.NAVBAR)
  }

  $punchHole() {
    this.tag('Background').shader = {
      type: Lightning.shaders.Hole,
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
    }
  }
  $unpunchHole() {
    this.tag('Background').shader = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    }
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
