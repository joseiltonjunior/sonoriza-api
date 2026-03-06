import { Artist } from '../entities/artist'

export type FetchArtistsResponseDTO = {
  data: Artist[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}
