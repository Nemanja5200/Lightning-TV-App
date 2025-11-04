import { tmdbService } from '../../../service/tmbdService'
import { parseCredits, parseDetailsResponse } from '../../../utils/parser'

export default async function fetchDetailsData(page, { id, type }) {
  const details = await tmdbService.getDetails(id, type)
  const credits = await tmdbService.getCredits(id, type)

  const parsedDetails = parseDetailsResponse(details, type)
  const parsedCredits = parseCredits(credits)

  page.props = {
    parsedDetails,
    parsedCredits,
  }
}
