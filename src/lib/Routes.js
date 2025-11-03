import { Home } from '../pages'
import { ELEMENTS } from '../utils/Elements'

export default {
  root: 'home',
  routes: [
    {
      path: 'home',
      component: Home,
      widgets: [ELEMENTS.NAVBAR],
    },
  ],
}
