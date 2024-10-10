import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryMusicalGenresRepository } from '@/repositories/in-memory/in-memory-musical-genres-repository'
import { FetchMusicalGenreUseCase } from './fetch-musical-genre'

let musicalGenreRepository: InMemoryMusicalGenresRepository
let fetchMusicalGenreUseCase: FetchMusicalGenreUseCase

describe('Get  Musical Genre Use Case', () => {
  beforeEach(() => {
    musicalGenreRepository = new InMemoryMusicalGenresRepository()
    fetchMusicalGenreUseCase = new FetchMusicalGenreUseCase(
      musicalGenreRepository,
    )
  })

  it('should be able to get a  musical genre', async () => {
    const resposneCreate = await musicalGenreRepository.create({
      name: 'Psytrance',
    })

    const { musicalGenre } = await fetchMusicalGenreUseCase.execute({
      id: resposneCreate.id,
    })

    expect(musicalGenre.id).toEqual(expect.any(String))
  })
})
