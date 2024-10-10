import { EditMusicUseCase } from './edit-music'
import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryMusicsRepository } from '@/repositories/in-memory/in-memory-musics-repository'

let musicRepository: InMemoryMusicsRepository
let editMusicUseCase: EditMusicUseCase

describe('Edit Music Use Case', () => {
  beforeEach(() => {
    musicRepository = new InMemoryMusicsRepository()
    editMusicUseCase = new EditMusicUseCase(musicRepository)
  })

  it('should be able to edit music', async () => {
    const { id } = await musicRepository.create({
      title: 'Ritmo I',
      album: 'Ritmo',
      artwork: '',
      color: '',
      url: '',
      musicalGenre: 'Psytrance',
    })

    const { music } = await editMusicUseCase.execute({
      id,
      title: 'Ritmo II',
      album: 'Ritmo',
      artwork: '',
      color: '',
      url: '',
      musicalGenre: 'Psytrance',
    })

    expect(music).toEqual(
      expect.objectContaining({
        title: 'Ritmo II',
      }),
    )
  })
})
