import { Genre } from '../entities/genre'

export interface GenresRepository {
  create(genre: Genre): Promise<void>
  findById(id: string): Promise<Genre | null>
  findByName(name: string): Promise<Genre | null>
  findMany(params: { page: number; limit: number }): Promise<{
    data: Genre[]
    total: number
  }>
  update(genre: Genre): Promise<void>
}

export const GenresRepositoryToken = Symbol('GenresRepository')
