import { api } from '../api/api'
import { TMBD_ROUTE } from '../constance/constance'

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
}
