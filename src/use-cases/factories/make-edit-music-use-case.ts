import { PrismaMusicsRepository } from '@/repositories/prisma/prisma-musics-repository'
import { EditMusicUseCase } from '@/use-cases/musics/edit-music'

export function makeEditMusicUseCase() {
  const prismaMusicRepository = new PrismaMusicsRepository()
  const editMusicUseCase = new EditMusicUseCase(prismaMusicRepository)

  return editMusicUseCase
}
