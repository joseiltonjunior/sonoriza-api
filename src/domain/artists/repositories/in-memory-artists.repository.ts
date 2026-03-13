import { Artist } from '../entities/artist'
import { ArtistsRepository } from './artists-repository'

export class InMemoryArtistsRepository implements ArtistsRepository {
  public items: Artist[] = []

  async create(artist: Artist): Promise<void> {
    this.items.push(artist)
  }

  async findById(id: string): Promise<Artist | null> {
    const artist = this.items.find((item) => item.id === id)

    if (!artist || artist.deletedAt) {
      return null
    }

    return artist
  }

  async findMany({
    page,
    limit,
    name,
    genreId,
  }: {
    page: number
    limit: number
    name?: string
    genreId?: string
  }): Promise<{ data: Artist[]; total: number }> {
    const normalizedName = name?.toLowerCase()

    const filtered = this.items.filter((artist) => {
      if (artist.deletedAt !== null) {
        return false
      }

      if (
        normalizedName &&
        !artist.name.toLowerCase().includes(normalizedName)
      ) {
        return false
      }

      if (genreId && !artist.genreIds.includes(genreId)) {
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

  async update(artist: Artist): Promise<void> {
    const index = this.items.findIndex((item) => item.id === artist.id)

    if (index >= 0) {
      this.items[index] = artist
    }
  }
}
