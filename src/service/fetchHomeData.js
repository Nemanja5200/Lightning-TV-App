import { CardItem, HorizontalContainer } from '../components'
import { ELEMENTS } from '../utils/Elements'
import { tmdbService } from './tmbdService'

export async function fetchHomeData() {
  try {
    // Fetch movies & series in parallel
    const [moviesData, seriesData] = await Promise.all([
      tmdbService.getNowPlayingMovies(),
      tmdbService.getPopularSeries(),
    ])

    // Helper for mapping TMDB data into CardItems
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

    // Return rows for your Lightning layout
    return [
      {
        type: HorizontalContainer,
        w: 1241,
        h: 464,
        props: {
          items: cardMovieItems,
          railTitle: ELEMENTS.MOVIES,
          h: 359,
          titleFontFace: 'Inter-Bold',
          titleFontSize: 24,
        },
      },
      {
        type: HorizontalContainer,
        w: 1241,
        h: 464,
        props: {
          items: cardSeriesItems,
          railTitle: ELEMENTS.SERIES,
          h: 359,
          titleFontFace: 'Inter-Bold',
          titleFontSize: 24,
        },
      },
    ]
  } catch (error) {
    console.error('❌ Failed to fetch TMDB data:', error)
    return [] // fail gracefully
  }
}
