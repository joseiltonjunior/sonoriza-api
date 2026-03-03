import { Music } from '../entities/music'

export interface MusicRepository {
  create(music: Music): Promise<void>
  findById(id: string): Promise<Music | null>
  findBySlug(slug: string): Promise<Music | null>
  findMany(params: { page: number; limit: number }): Promise<{
    data: Music[]
    total: number
  }>
  update(music: Music): Promise<void>
}

export const MusicRepositoryToken = Symbol('MusicRepository')
