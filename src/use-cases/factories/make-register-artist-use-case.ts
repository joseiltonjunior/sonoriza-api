import { PrismaArtistsRepository } from '@/repositories/prisma/prisma-artists-repository'
import { RegisterArtistUseCase } from '@/use-cases/artists/register-artist'

export function makeRegisterArtistUseCase() {
  const prismaArtistRepository = new PrismaArtistsRepository()
  const registerArtistUseCase = new RegisterArtistUseCase(
    prismaArtistRepository,
  )

  return registerArtistUseCase
}
