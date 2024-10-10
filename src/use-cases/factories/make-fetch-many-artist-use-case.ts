import { PrismaArtistsRepository } from '@/repositories/prisma/prisma-artists-repository'
import { FetchManyArtistsUseCase } from '@/use-cases/artists/fetch-many-artists'

export function makeFetchManyArtist() {
  const prismaArtistRepository = new PrismaArtistsRepository()
  const fetchManyArtistProfileUseCase = new FetchManyArtistsUseCase(
    prismaArtistRepository,
  )

  return fetchManyArtistProfileUseCase
}
