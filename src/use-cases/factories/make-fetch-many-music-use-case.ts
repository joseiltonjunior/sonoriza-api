import { PrismaMusicsRepository } from '@/repositories/prisma/prisma-musics-repository'
import { FetchManyMusicUseCase } from '@/use-cases/musics/fetch-many-musics'

export function makeFetchManyMusicUseCase() {
  const prismaMusicRepository = new PrismaMusicsRepository()
  const fetchManyMusicUseCase = new FetchManyMusicUseCase(prismaMusicRepository)

  return fetchManyMusicUseCase
}
