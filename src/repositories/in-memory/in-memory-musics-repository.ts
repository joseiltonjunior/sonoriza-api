import { Music, Prisma } from '@prisma/client'
import { MusicsPaginated, MusicsRepository } from '../musics-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryMusicsRepository implements MusicsRepository {
  public items: Music[] = []

  async findManyByPaginated(page: number): Promise<MusicsPaginated | null> {
    const musics = this.items.slice((page - 1) * 20, page * 20)

    if (!musics) {
      return null
    }

    return {
      musics,
      currentPage: page,
      totalItems: this.items.length,
      totalPages: Math.ceil(this.items.length / 10),
    }
  }

  async edit(data: Prisma.MusicUncheckedUpdateInput): Promise<Music> {
    const music = this.items.find((music) => music.id === data.id) as Music

    const index = this.items.findIndex((music) => music.id === data.id)

    const musicEdit = {
      ...music,
      album: data.album as string,
      artwork: data.artwork as string,
      title: data.title as string,
      musicalGenreId: data.musicalGenreId as string,
      artists: data.artists as string,
      url: data.url as string,
      color: data.color as string,
      updated_at: new Date(),
    }

    if (index !== -1) {
      this.items.splice(index, 1, musicEdit)
    }

    return musicEdit
  }

  async findById(id: string): Promise<Music | null> {
    const music = this.items.find((item) => item.id === id)

    if (!music) {
      return null
    }

    return music
  }

  async create(data: Prisma.MusicCreateInput): Promise<Music> {
    const music = {
      id: randomUUID(),
      album: data.album,
      title: data.title,
      artwork: data.artwork,
      url: data.url,
      color: data.color,
      created_at: new Date(),
      updated_at: new Date(),
      artists: data.artists,
      musicalGenreId: data.musicalGenre as string,
    }

    this.items.push(music)

    return music
  }
}
