import { PrismaMusicsRepository } from '@/repositories/prisma/prisma-musics-repository'
import { FetchMusicUseCase } from '@/use-cases/musics/fetch-music'

export function makeFetchMusicUseCase() {
  const prismaMusicRepository = new PrismaMusicsRepository()
  const fetchMusicUseCase = new FetchMusicUseCase(prismaMusicRepository)

  return fetchMusicUseCase
}
