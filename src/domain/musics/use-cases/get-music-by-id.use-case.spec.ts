import { Music } from '../entities/music'
import { MusicNotFoundError } from '../errors/music-not-found-error'
import { InMemoryMusicRepository } from '../repositories/in-memory-music.repository'
import { GetMusicByIdUseCase } from './get-music-by-id.use-case'

function makeMusic() {
  return new Music(
    'music-1',
    'Music 1',
    'music-1',
    'https://cdn.sonoriza.com/musics/1.mp3',
    null,
    null,
    null,
    0,
    0,
    null,
    null,
    null,
    null,
    [],
    [],
  )
}

describe('GetMusicByIdUseCase', () => {
  it('should return a music by id', async () => {
    const repo = new InMemoryMusicRepository()
    const useCase = new GetMusicByIdUseCase(repo)

    await repo.create(makeMusic())

    const result = await useCase.execute('music-1')

    expect(result).toEqual(
      expect.objectContaining({
        id: 'music-1',
        title: 'Music 1',
      }),
    )
  })

  it('should throw when music does not exist', async () => {
    const repo = new InMemoryMusicRepository()
    const useCase = new GetMusicByIdUseCase(repo)

    await expect(useCase.execute('missing-id')).rejects.toBeInstanceOf(
      MusicNotFoundError,
    )
  })
})
