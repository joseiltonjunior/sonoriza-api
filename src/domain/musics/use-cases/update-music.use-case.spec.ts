import { randomUUID } from 'node:crypto'

import { Music } from '../entities/music'
import { MusicNotFoundError } from '../errors/music-not-found-error'
import { InMemoryMusicRepository } from '../repositories/in-memory-music.repository'
import { UpdateMusicUseCase } from './update-music.use-case'

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

describe('UpdateMusicUseCase', () => {
  it('should update a music', async () => {
    const repo = new InMemoryMusicRepository()
    const useCase = new UpdateMusicUseCase(repo)

    const music = makeMusic()
    await repo.create(music)

    const newGenreId = randomUUID()
    const newArtistId = randomUUID()

    const updated = await useCase.execute(music.id, {
      title: 'Masada Remastered',
      color: '#111111',
      genreId: newGenreId,
      artistIds: [newArtistId],
    })

    expect(updated).toEqual(
      expect.objectContaining({
        id: music.id,
        title: 'Masada Remastered',
        color: '#111111',
        like: 10,
        view: 250,
        genreId: newGenreId,
        artistIds: [newArtistId],
      }),
    )
  })

  it('should throw when music does not exist', async () => {
    const repo = new InMemoryMusicRepository()
    const useCase = new UpdateMusicUseCase(repo)

    await expect(
      useCase.execute(randomUUID(), {
        title: 'Will Fail',
      }),
    ).rejects.toBeInstanceOf(MusicNotFoundError)
  })
})
