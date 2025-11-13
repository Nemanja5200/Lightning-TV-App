import { HorCard } from '../../../components/Card'
import { TMBD_ROUTE } from '../../../constance/constance'
import { tmdbService } from '../../../service/tmbdService'

export default async function fetchMoviesData(page) {
  try {
    const upcomingMovies = await tmdbService.getUpcomingMovies()

    const createCardItems = (items, isSeries = false) =>
      items.map((item) => ({
        type: HorCard,
        item: {
          id: item.id,
          title: isSeries ? item.name : item.title,
          image: `${TMBD_ROUTE.IMAGE_500}${item.poster_path}`,
          mediaType: isSeries ? 'series' : 'movie',
        },
      }))

    const getMovieInfo = async (items = []) => {
      const movieInfoPromises = items.filter(Boolean).map(async (item) => {
        try {
          const movieImages = await tmdbService.getMovieImages(item.id)
          return {
            id: item.id,
            title: item.titlezx || item.title || 'Untitled',
            overview: item.overview || 'No overview available.',
            image: movieImages.data.backdrops.slice(0, 5).map((item) => item.file_path) || [],
          }
        } catch (error) {
          console.error(`Failed to get images for movie ${item.id}:`, error)
          return {
            id: item.id,
            title: item.original_title || item.title || 'Untitled',
            overview: item.overview || 'No overview available.',
            image: [],
          }
        }
      })

      return Promise.all(movieInfoPromises)
    }

    const cardMovieItems = createCardItems(upcomingMovies.results)
    const movieInfo = await getMovieInfo(upcomingMovies.results)

    page.props = {
      cardMovieItems,
      movieInfo,
    }
  } catch (error) {
    console.error('❌ Failed to fetch TMDB data:', error)
    page.props = {
      cardMovieItems: [],
      movieInfo: [],
    }
  }
}
