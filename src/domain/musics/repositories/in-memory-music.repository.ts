import { Music } from '../entities/music'
import { MusicRepository } from './music-repository'

export class InMemoryMusicRepository implements MusicRepository {
  public items: Music[] = []

  async create(music: Music): Promise<void> {
    this.items.push(music)
  }

  async findById(id: string): Promise<Music | null> {
    return this.items.find((music) => music.id === id) ?? null
  }

  async findBySlug(slug: string): Promise<Music | null> {
    return this.items.find((music) => music.slug === slug) ?? null
  }

  async findMany({
    page,
    limit,
  }: {
    page: number
    limit: number
  }): Promise<{ data: Music[]; total: number }> {
    const filtered = this.items.filter((music) => music.deletedAt === null)

    const total = filtered.length
    const start = (page - 1) * limit
    const end = start + limit

    return {
      data: filtered.slice(start, end),
      total,
    }
  }

  async update(music: Music): Promise<void> {
    const index = this.items.findIndex((item) => item.id === music.id)

    if (index >= 0) {
      this.items[index] = music
    }
  }
}
