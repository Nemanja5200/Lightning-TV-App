import { Details, Home, Movies } from '../pages'
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
      on: fetchHomeData,
    },
    {
      path: PATHS.MOVIES,
      component: Movies,
      widgets: [ELEMENTS.NAVBAR],
    },

    {
      path: PATHS.DETAILS,
      component: Details,
    },
  ],
}
