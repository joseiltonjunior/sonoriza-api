import { PaginatedProps } from '@/utils/paginated-types'
import { Prisma, Music } from '@prisma/client'

export interface MusicsPaginated extends PaginatedProps {
  musics: Music[]
}
export interface MusicsRepository {
  findById(id: string): Promise<Music | null>
  create(
    data: Prisma.MusicCreateInput & { artists: string[]; musicalGenre: string },
  ): Promise<Music>
  edit(data: Prisma.MusicUpdateInput): Promise<Music>
  findManyByPaginated(page: number): Promise<MusicsPaginated | null>
}
