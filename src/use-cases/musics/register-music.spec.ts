import { RegisterMusicUseCase } from './register-music'
import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryMusicsRepository } from '@/repositories/in-memory/in-memory-musics-repository'
import { InMemoryArtistsRepository } from '@/repositories/in-memory/in-memory-artists-repository'
import { RegisterArtistUseCase } from '../artists/register-artist'
import { InMemoryMusicalGenresRepository } from '@/repositories/in-memory/in-memory-musical-genres-repository'
import { RegisterMusicalGenreUseCase } from '../musicalGenres/register-musical-genre'

let musicRepository: InMemoryMusicsRepository
let registerMusicUseCase: RegisterMusicUseCase
let artistRepository: InMemoryArtistsRepository
let registerArtistUseCase: RegisterArtistUseCase
let musicalGenreRepository: InMemoryMusicalGenresRepository
let createMusicalGenreUseCase: RegisterMusicalGenreUseCase

describe('Music Register Use Case', () => {
  beforeEach(() => {
    musicRepository = new InMemoryMusicsRepository()
    registerMusicUseCase = new RegisterMusicUseCase(musicRepository)

    artistRepository = new InMemoryArtistsRepository()
    registerArtistUseCase = new RegisterArtistUseCase(artistRepository)

    musicalGenreRepository = new InMemoryMusicalGenresRepository()
    createMusicalGenreUseCase = new RegisterMusicalGenreUseCase(
      musicalGenreRepository,
    )
  })

  it('should be able to register', async () => {
    const { musicalGenre } = await createMusicalGenreUseCase.execute({
      name: 'Psytrance',
    })

    const { artist } = await registerArtistUseCase.execute({
      name: 'Ritmo',
      photoURL: 'ritmo.jpeg',
    })

    const { music } = await registerMusicUseCase.execute({
      title: 'Ritmo',
      album: 'Ritmo',
      artwork: '',
      color: '',
      url: '',
      artistsId: [artist.id],
      musicalGenreId: musicalGenre.id,
    })

    expect(music.id).toEqual(expect.any(String))
  })
})
