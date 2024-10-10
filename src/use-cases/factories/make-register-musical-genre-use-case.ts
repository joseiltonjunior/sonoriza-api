import { PrismaMusicalGenresRepository } from '@/repositories/prisma/prisma-musical-genres-repository'
import { RegisterMusicalGenreUseCase } from '@/use-cases/musicalGenres/register-musical-genre'

export function makeRegisterMusicalGenreUseCase() {
  const prismaMusicalGenreRepository = new PrismaMusicalGenresRepository()
  const createMusicalGenreUseCase = new RegisterMusicalGenreUseCase(
    prismaMusicalGenreRepository,
  )

  return createMusicalGenreUseCase
}
