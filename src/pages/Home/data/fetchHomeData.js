import { VerCard } from '../../../components/Card'
import { tmdbService } from '../../../service/tmbdService'

export default async function fetchHomeData(page) {
  try {
    const [moviesData, seriesData] = await Promise.all([
      tmdbService.getNowPlayingMovies(),
      tmdbService.getPopularSeries(),
    ])

    const createCardItems = (items, isSeries = false) =>
      items.slice(0, 5).map((item) => ({
        type: VerCard,
        item: {
          id: item.id,
          title: isSeries ? item.name : item.title,
          image: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          mediaType: isSeries ? 'series' : 'movie',
        },
      }))

    const cardMovieItems = createCardItems(moviesData.results)
    const cardSeriesItems = createCardItems(seriesData.results, true)

    page.props = {
      cardMovieItems,
      cardSeriesItems,
    }
  } catch (error) {
    console.error('❌ Failed to fetch TMDB data:', error)
    page.props = {
      cardMovieItems: [],
      cardSeriesItems: [],
    }
  }
}
