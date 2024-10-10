import { PrismaArtistsRepository } from '@/repositories/prisma/prisma-artists-repository'
import { FetchArtistUseCase } from '@/use-cases/artists/fetch-artist'

export function makeFetchArtistUseCase() {
  const prismaArtistRepository = new PrismaArtistsRepository()
  const fetchArtistUseCase = new FetchArtistUseCase(prismaArtistRepository)

  return fetchArtistUseCase
}
