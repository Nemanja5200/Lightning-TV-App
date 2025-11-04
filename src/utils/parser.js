import { DETAILS_TYPE } from '../constance/constance'

// Parse movie details from TMDB API
export const parseMovieDetails = (rawDetails) => ({
  title: rawDetails.title || 'Unknown Title',
  genre: rawDetails.genres?.[0]?.name || 'Unknown',
  country: rawDetails.origin_country?.[0] || 'Unknown',
  duration: `${rawDetails.runtime || 0} Minutes`,
  year: rawDetails.release_date?.split('-')[0] || 'Unknown',
  rating: rawDetails.vote_average?.toFixed(1) || 'N/A',
  overview: rawDetails.overview || 'No description available.',
  poster: rawDetails.poster_path || '',
  heroPoster: rawDetails.backdrop_path || '',
})

// Parse series details from TMDB API
export const parseSeriesDetails = (rawDetails) => ({
  title: rawDetails.name || 'Unknown Title',
  genre: rawDetails.genres?.[0]?.name || 'Unknown',
  country: rawDetails.origin_country?.[0] || 'Unknown',
  duration: `${rawDetails.number_of_seasons || 0} Seasons`,
  year: rawDetails.first_air_date?.split('-')[0] || 'Unknown',
  rating: rawDetails.vote_average?.toFixed(1) || 'N/A',
  overview: rawDetails.overview || 'No description available.',
  poster: rawDetails.poster_path || '',
  heroPoster: rawDetails.backdrop_path || '',
})

export const parseCredits = (rawCredits) => {
  const cast =
    rawCredits.cast
      ?.slice(0, 4)
      .map((member) => member.name)
      .join(', ') || 'Cast info not available'

  const director =
    rawCredits.crew?.find((member) => member.job === 'Director')?.name || 'Unknown Director'

  return { cast, director }
}

export const parseDetailsResponse = (rawDetails, mediaType) => {
  const details =
    mediaType === DETAILS_TYPE.MOVIE
      ? parseMovieDetails(rawDetails)
      : parseSeriesDetails(rawDetails)

  return details
}
