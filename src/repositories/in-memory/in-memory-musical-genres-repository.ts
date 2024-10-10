import { Prisma, MusicalGenre } from '@prisma/client'
import { MusicalGenresRepository } from '../musical-genres-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryMusicalGenresRepository
  implements MusicalGenresRepository
{
  public items: MusicalGenre[] = []

  async edit(
    data: Prisma.MusicalGenreUncheckedUpdateInput,
  ): Promise<MusicalGenre> {
    const musicalGenre = this.items.find(
      (item) => item.id !== data.id,
    ) as MusicalGenre

    const index = this.items.findIndex((item) => item.id === data.id)

    const musicalGenreEdit = {
      ...musicalGenre,
      name: data.name as string,
      updated_at: new Date(),
    }

    if (index !== -1) {
      this.items.splice(index, 1, musicalGenreEdit)
    }

    return musicalGenreEdit
  }

  async findById(id: string): Promise<MusicalGenre | null> {
    const musicalGenre = this.items.find((item) => item.id === id)

    if (!musicalGenre) {
      return null
    }

    return musicalGenre
  }

  async findByName(name: string): Promise<MusicalGenre | null> {
    const musicalGenre = this.items.find((item) => item.name === name)

    if (!musicalGenre) {
      return null
    }

    return musicalGenre
  }

  async create(data: Prisma.MusicalGenreCreateInput): Promise<MusicalGenre> {
    const musicalGenre = {
      id: randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
      name: data.name,
    }

    this.items.push(musicalGenre)

    return musicalGenre
  }
}
