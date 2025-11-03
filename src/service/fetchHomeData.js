import { CardItem } from '../components'
import { tmdbService } from './tmbdService'

export async function fetchHomeData() {
  try {
    const [moviesData, seriesData] = await Promise.all([
      tmdbService.getNowPlayingMovies(),
      tmdbService.getPopularSeries(),
    ])

    const createCardItems = (items, isSeries = false) =>
      items.slice(0, 5).map((item) => ({
        type: CardItem,
        item: {
          title: isSeries ? item.name : item.title,
          image: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        },
      }))

    const cardMovieItems = createCardItems(moviesData.results)
    const cardSeriesItems = createCardItems(seriesData.results, true)

    return {
      cardMovieItems,
      cardSeriesItems,
    }
  } catch (error) {
    console.error('❌ Failed to fetch TMDB data:', error)
    return [] // fail gracefully
  }
}
