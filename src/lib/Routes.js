import { Home } from '../pages'
import { ELEMENTS } from '../constance/Elements'
import { PATHS } from '../constance/paths'
import fetchHomeData from '../pages/Home/data/fetchHomeData'

export default {
  root: PATHS.HOME,
  routes: [
    {
      path: PATHS.HOME,
      component: Home,
      widgets: [ELEMENTS.NAVBAR],
      before: fetchHomeData,
    },
  ],
}
