import { randomUUID } from 'node:crypto'

import { Music } from '../entities/music'
import { MusicNotFoundError } from '../errors/music-not-found-error'
import { InMemoryMusicRepository } from '../repositories/in-memory-music.repository'
import { DeleteMusicUseCase } from './delete-music.use-case'

function makeMusic() {
  return new Music(
    randomUUID(),
    'Masada',
    'masada',
    'https://cdn.sonoriza.com/musics/masada.mp3',
    'Best Of',
    'https://cdn.sonoriza.com/covers/masada.jpg',
    '#c53a27',
    10,
    250,
    245,
    new Date('2024-01-01T00:00:00.000Z'),
    randomUUID(),
    null,
    [randomUUID()],
    [],
  )
}

describe('DeleteMusicUseCase', () => {
  it('should soft delete a music', async () => {
    const repo = new InMemoryMusicRepository()
    const useCase = new DeleteMusicUseCase(repo)

    const music = makeMusic()
    await repo.create(music)

    await useCase.execute(music.id)

    const deleted = await repo.findById(music.id)
    const stored = repo.items.find((item) => item.id === music.id)

    expect(deleted).toBeNull()
    expect(stored?.deletedAt).toBeInstanceOf(Date)
  })

  it('should throw when music does not exist', async () => {
    const repo = new InMemoryMusicRepository()
    const useCase = new DeleteMusicUseCase(repo)

    await expect(useCase.execute(randomUUID())).rejects.toBeInstanceOf(
      MusicNotFoundError,
    )
  })
})
