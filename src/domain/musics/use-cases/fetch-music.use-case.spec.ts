import { Music } from '../entities/music'
import { InMemoryMusicRepository } from '../repositories/in-memory-music.repository'
import { FetchMusicsUseCase } from './fetch-music.use-case'

function makeMusic(index: number, artistIds: string[] = []) {
  return new Music(
    `music-${index}`,
    `Music ${index}`,
    `music-${index}`,
    `https://cdn.sonoriza.com/musics/${index}.mp3`,
    null,
    null,
    null,
    0,
    0,
    null,
    null,
    null,
    null,
    artistIds,
    [],
  )
}

describe('FetchMusicsUseCase', () => {
  it('should fetch paginated musics', async () => {
    const repo = new InMemoryMusicRepository()
    const useCase = new FetchMusicsUseCase(repo)

    for (let i = 1; i <= 25; i++) {
      await repo.create(makeMusic(i))
    }

    const toDelete = await repo.findById('music-25')
    if (toDelete) {
      toDelete.softDelete()
      await repo.update(toDelete)
    }

    const result = await useCase.execute({ page: 1 })

    expect(result.data).toHaveLength(20)
    expect(result.meta).toEqual({
      total: 24,
      page: 1,
      lastPage: 2,
    })
  })

  it('should fetch second page with remaining items', async () => {
    const repo = new InMemoryMusicRepository()
    const useCase = new FetchMusicsUseCase(repo)

    for (let i = 1; i <= 25; i++) {
      await repo.create(makeMusic(i))
    }

    const toDelete = await repo.findById('music-25')
    if (toDelete) {
      toDelete.softDelete()
      await repo.update(toDelete)
    }

    const result = await useCase.execute({ page: 2 })

    expect(result.data).toHaveLength(4)
    expect(result.meta).toEqual({
      total: 24,
      page: 2,
      lastPage: 2,
    })
  })

  it('should filter musics by artist id when provided', async () => {
    const repo = new InMemoryMusicRepository()
    const useCase = new FetchMusicsUseCase(repo)

    await repo.create(makeMusic(1, ['artist-a']))
    await repo.create(makeMusic(2, ['artist-b']))
    await repo.create(makeMusic(3, ['artist-a', 'artist-b']))

    const result = await useCase.execute({ page: 1, artistId: 'artist-a' })

    expect(result.data).toHaveLength(2)
    expect(result.data.map((music) => music.id)).toEqual(['music-1', 'music-3'])
    expect(result.meta).toEqual({
      total: 2,
      page: 1,
      lastPage: 1,
    })
  })
})
