import { Details, Home, Movies } from '../pages'
import { ELEMENTS } from '../constance/Elements'
import { PATHS } from '../constance/paths'
import fetchHomeData from '../pages/Home/data/fetchHomeData'
import fetchDetailsData from '../pages/Details/data/fetchDetailsData'
import fetchMoviesData from '../pages/Movies/data/fetchMoviesData'

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
      on: fetchMoviesData,
    },

    {
      path: `${PATHS.DETAILS}/:type/:id`,
      component: Details,
      on: fetchDetailsData,
    },
  ],
}
