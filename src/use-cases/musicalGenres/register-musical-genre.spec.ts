import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryMusicalGenresRepository } from '@/repositories/in-memory/in-memory-musical-genres-repository'
import { RegisterMusicalGenreUseCase } from './register-musical-genre'

let musicalGenreRepository: InMemoryMusicalGenresRepository
let createMusicalGenreUseCase: RegisterMusicalGenreUseCase

describe('Add a  Musical Genre Use Case', () => {
  beforeEach(() => {
    musicalGenreRepository = new InMemoryMusicalGenresRepository()
    createMusicalGenreUseCase = new RegisterMusicalGenreUseCase(
      musicalGenreRepository,
    )
  })

  it('should be able to register a address', async () => {
    const { musicalGenre } = await createMusicalGenreUseCase.execute({
      name: 'Psytrance',
    })

    expect(musicalGenre.id).toEqual(expect.any(String))
    expect(musicalGenre.created_at).toEqual(expect.any(Date))
  })
})
