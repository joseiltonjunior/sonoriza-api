import { Genre } from '../entities/genre'

export type FetchGenresResponseDTO = {
  data: Genre[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}
