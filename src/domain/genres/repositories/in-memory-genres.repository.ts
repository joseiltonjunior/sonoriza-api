import { Genre } from '../entities/genre'
import { GenresRepository } from './genres-repository'

export class InMemoryGenresRepository implements GenresRepository {
  public items: Genre[] = []

  async create(genre: Genre): Promise<void> {
    this.items.push(genre)
  }

  async findById(id: string): Promise<Genre | null> {
    const genre = this.items.find((item) => item.id === id)

    if (!genre || genre.deletedAt) {
      return null
    }

    return genre
  }

  async findByName(name: string): Promise<Genre | null> {
    const genre = this.items.find((item) => item.name === name)

    if (!genre || genre.deletedAt) {
      return null
    }

    return genre
  }

  async findMany({
    page,
    limit,
  }: {
    page: number
    limit: number
  }): Promise<{ data: Genre[]; total: number }> {
    const filtered = this.items.filter((genre) => genre.deletedAt === null)

    const total = filtered.length
    const start = (page - 1) * limit
    const end = start + limit

    return {
      data: filtered.slice(start, end),
      total,
    }
  }

  async update(genre: Genre): Promise<void> {
    const index = this.items.findIndex((item) => item.id === genre.id)

    if (index >= 0) {
      this.items[index] = genre
    }
  }
}
