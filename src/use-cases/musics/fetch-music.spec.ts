import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryMusicsRepository } from '@/repositories/in-memory/in-memory-musics-repository'

import { FetchMusicUseCase } from './fetch-music'
import { UserNotExistsError } from '../errors/user-not-exists'
import { randomUUID } from 'node:crypto'

let musicRepository: InMemoryMusicsRepository
let fetchMusicUseCase: FetchMusicUseCase

describe('Fetch Music Use Case', () => {
  beforeEach(() => {
    musicRepository = new InMemoryMusicsRepository()
    fetchMusicUseCase = new FetchMusicUseCase(musicRepository)
  })

  it('should be able to music', async () => {
    const musicResponse = await musicRepository.create({
      title: 'Ritmo',
      album: 'Ritmo',
      artwork: '',
      color: '',
      url: '',
    })

    const { music } = await fetchMusicUseCase.execute({
      id: musicResponse.id,
    })

    expect(music.id).toEqual(expect.any(String))
    expect(music.title).toEqual('Ritmo')
  })

  it('should not be able to get music with wrong id', async () => {
    expect(() =>
      fetchMusicUseCase.execute({
        id: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(UserNotExistsError)
  })
})
