import { Artist, Prisma } from '@prisma/client'
import { ArtistsRepository, ArtistsPaginated } from '../artists-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryArtistsRepository implements ArtistsRepository {
  public items: Artist[] = []

  async findManyByPaginated(page: number): Promise<ArtistsPaginated | null> {
    const artists = this.items.slice((page - 1) * 20, page * 20)

    if (!artists) {
      return null
    }

    return {
      artists,
      currentPage: page,
      totalItems: this.items.length,
      totalPages: Math.ceil(this.items.length / 20),
    }
  }

  async findById(id: string): Promise<Artist | null> {
    const artist = this.items.find((item) => item.id === id)

    if (!artist) {
      return null
    }

    return artist
  }

  async edit(data: Prisma.ArtistUpdateInput): Promise<Artist> {
    const artist = this.items.find((item) => item.id === data.id) as Artist

    const index = this.items.findIndex((item) => item.id === data.id)

    const artistEdit = {
      ...artist,
      name: data.name as string,
      photoURL: data.photoURL as string,
      updated_at: new Date(),
    }

    if (index !== -1) {
      this.items.splice(index, 1, artistEdit)
    }

    return artistEdit
  }

  async create(data: Prisma.ArtistCreateInput): Promise<Artist> {
    const artist = {
      id: randomUUID(),
      name: data.name,
      photoURL: data.photoURL,
      likes: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(artist)

    return artist
  }
}
