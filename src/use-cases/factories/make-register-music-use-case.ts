import { PrismaMusicsRepository } from '@/repositories/prisma/prisma-musics-repository'
import { RegisterMusicUseCase } from '@/use-cases/musics/register-music'

export function makeRegisterMusicUseCase() {
  const prismaMusicRepository = new PrismaMusicsRepository()
  const registerMusicUseCase = new RegisterMusicUseCase(prismaMusicRepository)

  return registerMusicUseCase
}
