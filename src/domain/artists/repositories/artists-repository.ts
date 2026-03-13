import { Artist } from '../entities/artist'

export interface ArtistsRepository {
  create(artist: Artist): Promise<void>
  findById(id: string): Promise<Artist | null>
  findMany(params: {
    page: number
    limit: number
    name?: string
    genreId?: string
  }): Promise<{
    data: Artist[]
    total: number
  }>
  update(artist: Artist): Promise<void>
}

export const ArtistsRepositoryToken = Symbol('ArtistsRepository')
