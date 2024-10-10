import { PrismaArtistsRepository } from '@/repositories/prisma/prisma-artists-repository'
import { EditArtistUseCase } from '@/use-cases/artists/edit-artist'

export function makeEditArtistseCase() {
  const prismaArtistRepository = new PrismaArtistsRepository()
  const editArtistProfileUseCase = new EditArtistUseCase(prismaArtistRepository)

  return editArtistProfileUseCase
}
