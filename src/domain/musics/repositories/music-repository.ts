import { Music } from '../entities/music'

export interface MusicRepository {
  create(music: Music): Promise<void>
  findById(id: string): Promise<Music | null>
  findBySlug(slug: string): Promise<Music | null>
  findMany(params: {
    page: number
    limit: number
    artistId?: string
    title?: string
    album?: string
  }): Promise<{
    data: Music[]
    total: number
  }>
  update(music: Music): Promise<void>
}

export const MusicRepositoryToken = Symbol('MusicRepository')
