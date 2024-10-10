import { Prisma, MusicalGenre } from '@prisma/client'

export interface MusicalGenresRepository {
  create(data: Prisma.MusicalGenreCreateInput): Promise<MusicalGenre>
  findById(id: string): Promise<MusicalGenre | null>
  findByName(name: string): Promise<MusicalGenre | null>
  edit(data: Prisma.MusicalGenreUpdateInput): Promise<MusicalGenre>
}
