import { PrismaMusicalGenresRepository } from '@/repositories/prisma/prisma-musical-genres-repository'
import { FetchMusicalGenreUseCase } from '@/use-cases/musicalGenres/fetch-musical-genre'

export function makeFetchMusicalGenreUseCase() {
  const prismaOrderRepository = new PrismaMusicalGenresRepository()
  const fetchMusicalGenreUseCase = new FetchMusicalGenreUseCase(
    prismaOrderRepository,
  )

  return fetchMusicalGenreUseCase
}
