import { api } from '../api/api'
import { DETAILS_TYPE, TMBD_ROUTE } from '../constance/constance'

export const tmdbService = {
  async getNowPlayingMovies(page = 1) {
    const response = await api.get(TMBD_ROUTE.NOW_PLAYING_MOVIES, {
      params: { page },
    })
    return response.data
  },

  async getTrendingMovies(timeWindow = 'week') {
    const url = `${TMBD_ROUTE.TRENDING_MOVIES}${timeWindow}`
    const response = await api.get(url)
    return response.data
  },

  async getPopularSeries(page = 1) {
    const response = await api.get(TMBD_ROUTE.POPULAR_SHOWS, {
      params: { page },
    })
    return response.data
  },

  async getDetails(id, type) {
    if (type === DETAILS_TYPE.MOVIE) {
      const responce = await api.get(TMBD_ROUTE.MDETAILS + id)
      return responce.data
    }

    const responce = await api.get(TMBD_ROUTE.SDETAILS + id)
    return responce.data
  },

  async getCredits(id, type) {
    if (type === DETAILS_TYPE.MOVIE) {
      const responce = await api.get(TMBD_ROUTE.MOViE_CREDITS.replace('{id}', id))
      return responce.data
    }

    const responce = await api.get(TMBD_ROUTE.SERIES_CREDITS.replace('{id}', id))
    return responce.data
  },
}
