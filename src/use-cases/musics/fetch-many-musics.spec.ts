import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryMusicsRepository } from '@/repositories/in-memory/in-memory-musics-repository'

import { FetchManyMusicUseCase } from './fetch-many-musics'

let musicRepository: InMemoryMusicsRepository
let fetchManyMusicProfileUseCase: FetchManyMusicUseCase

describe('Fetch Many Musics Use Case', () => {
  beforeEach(() => {
    musicRepository = new InMemoryMusicsRepository()
    fetchManyMusicProfileUseCase = new FetchManyMusicUseCase(musicRepository)
  })

  it('should be able to get a music list paginated', async () => {
    await musicRepository.create({
      title: 'Ritmo',
      album: 'Ritmo',
      artwork: '',
      color: '',
      url: '',
    })

    await musicRepository.create({
      title: 'Ritmo I',
      album: 'Ritmo',
      artwork: '',
      color: '',
      url: '',
    })

    await musicRepository.create({
      title: 'Ritmo II',
      album: 'Ritmo',
      artwork: '',
      color: '',
      url: '',
    })

    const { musics } = await fetchManyMusicProfileUseCase.execute({ page: 1 })

    expect(musics).toHaveLength(3)
    expect(musics).toEqual([
      expect.objectContaining({ title: 'Ritmo' }),
      expect.objectContaining({ title: 'Ritmo I' }),
      expect.objectContaining({ title: 'Ritmo II' }),
    ])
  })
})
