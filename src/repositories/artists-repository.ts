import { PaginatedProps } from '@/utils/paginated-types'
import { Prisma, Artist } from '@prisma/client'

export interface ArtistsPaginated extends PaginatedProps {
  artists: Artist[]
}
export interface ArtistsRepository {
  findById(id: string): Promise<Artist | null>
  create(data: Prisma.ArtistCreateInput): Promise<Artist>
  edit(data: Prisma.ArtistUpdateInput): Promise<Artist>
  findManyByPaginated(page: number): Promise<ArtistsPaginated | null>
}
