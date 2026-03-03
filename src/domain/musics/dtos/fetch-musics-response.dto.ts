import { Music } from '../entities/music'

export interface FetchMusicsResponseDTO {
  data: Music[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}
