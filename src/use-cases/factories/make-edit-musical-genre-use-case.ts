import { PrismaMusicalGenresRepository } from '@/repositories/prisma/prisma-musical-genres-repository'
import { EditMusicalGenreUseCase } from '@/use-cases/musicalGenres/edit-musical-genre'

export function makeEditMusicalGenresUseCase() {
  const prismaMusicalGenreRepository = new PrismaMusicalGenresRepository()
  const fetchMusicalGenresUseCase = new EditMusicalGenreUseCase(
    prismaMusicalGenreRepository,
  )

  return fetchMusicalGenresUseCase
}
