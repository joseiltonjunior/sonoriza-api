import { Music } from '../entities/music'
import { MusicRepository } from './music-repository'

export class InMemoryMusicRepository implements MusicRepository {
  public items: Music[] = []

  async create(music: Music): Promise<void> {
    this.items.push(music)
  }

  async findById(id: string): Promise<Music | null> {
    const music = this.items.find((item) => item.id === id)

    if (!music || music.deletedAt !== null) {
      return null
    }

    return music
  }

  async findBySlug(slug: string): Promise<Music | null> {
    const music = this.items.find((item) => item.slug === slug)

    if (!music || music.deletedAt !== null) {
      return null
    }

    return music
  }

  async findMany({
    page,
    limit,
    artistId,
    title,
    album,
  }: {
    page: number
    limit: number
    artistId?: string
    title?: string
    album?: string
  }): Promise<{ data: Music[]; total: number }> {
    const normalizedTitle = title?.toLowerCase()
    const normalizedAlbum = album?.toLowerCase()

    const filtered = this.items.filter((music) => {
      if (music.deletedAt !== null) {
        return false
      }

      if (artistId && !music.artistIds.includes(artistId)) {
        return false
      }

      if (
        normalizedTitle &&
        !music.title.toLowerCase().includes(normalizedTitle)
      ) {
        return false
      }

      if (
        normalizedAlbum &&
        !(music.album?.toLowerCase().includes(normalizedAlbum) ?? false)
      ) {
        return false
      }

      return true
    })

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
