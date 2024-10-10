import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryMusicalGenresRepository } from '@/repositories/in-memory/in-memory-musical-genres-repository'
import { EditMusicalGenreUseCase } from './edit-musical-genre'

let musicalGenreRepository: InMemoryMusicalGenresRepository
let editMusicalGenreUseCase: EditMusicalGenreUseCase

describe('Edit musical genre Use case', () => {
  beforeEach(() => {
    musicalGenreRepository = new InMemoryMusicalGenresRepository()
    editMusicalGenreUseCase = new EditMusicalGenreUseCase(
      musicalGenreRepository,
    )
  })

  it('should be able to edit musical genre', async () => {
    const newMusicalGenre = await musicalGenreRepository.create({
      name: 'Psytrance',
    })

    const { musicalGenre } = await editMusicalGenreUseCase.execute({
      name: 'Deep House',
      id: newMusicalGenre.id,
    })

    expect(musicalGenre.name).toEqual('Deep House')
  })
})
