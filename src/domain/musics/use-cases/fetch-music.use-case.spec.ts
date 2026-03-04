import { Music } from '../entities/music'
import { InMemoryMusicRepository } from '../repositories/in-memory-music.repository'
import { FetchMusicsUseCase } from './fetch-music.use-case'

function makeMusic(index: number) {
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
    [],
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
})
