import { randomUUID } from 'node:crypto'

import { CreateMusicUseCase } from './create-music.use-case'
import { MusicSlugAlreadyExistsError } from '../errors/music-slug-already-exists.error'
import { GenreNotFoundError } from '../errors/genre-not-found.error'
import { ArtistNotFoundError } from '../errors/artist-not-found.error'
import { InMemoryMusicRepository } from '../repositories/in-memory-music.repository'
import { InMemoryArtistsRepository } from '@/domain/artists/repositories/in-memory-artists.repository'
import { InMemoryGenresRepository } from '@/domain/genres/repositories/in-memory-genres.repository'
import { Artist } from '@/domain/artists/entities/artist'
import { Genre } from '@/domain/genres/entities/genre'

describe('CreateMusicUseCase', () => {
  it('should create a new music with default counters', async () => {
    const artistId = randomUUID()
    const genreId = randomUUID()

    const musicRepo = new InMemoryMusicRepository()
    const artistsRepo = new InMemoryArtistsRepository()
    const genresRepo = new InMemoryGenresRepository()

    await artistsRepo.create(
      new Artist(
        artistId,
        'Djonga',
        'https://cdn.sonoriza.com/artists/djonga.jpg',
        0,
      ),
    )

    await genresRepo.create(new Genre(genreId, 'Rap'))

    const useCase = new CreateMusicUseCase(musicRepo, artistsRepo, genresRepo)

    const result = await useCase.execute({
      title: 'Masada',
      slug: 'masada',
      audioPath: 'https://cdn.sonoriza.com/musics/masada.mp3',
      album: 'Best Of',
      coverPath: 'https://cdn.sonoriza.com/covers/masada.jpg',
      color: '#c53a27',
      durationSec: 245,
      releaseDate: new Date('2024-01-01T00:00:00.000Z'),
      genreId,
      artistIds: [artistId],
    })

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Masada',
        slug: 'masada',
        genreId,
        like: 0,
        view: 0,
      }),
    )

    expect(musicRepo.items.length).toBe(1)
  })

  it('should not allow creating a music with duplicated slug', async () => {
    const artistId = randomUUID()
    const genreId = randomUUID()

    const musicRepo = new InMemoryMusicRepository()
    const artistsRepo = new InMemoryArtistsRepository()
    const genresRepo = new InMemoryGenresRepository()

    await artistsRepo.create(
      new Artist(
        artistId,
        'Djonga',
        'https://cdn.sonoriza.com/artists/djonga.jpg',
        0,
      ),
    )

    await genresRepo.create(new Genre(genreId, 'Rap'))

    const useCase = new CreateMusicUseCase(musicRepo, artistsRepo, genresRepo)

    await useCase.execute({
      title: 'Masada',
      slug: 'masada',
      audioPath: 'https://cdn.sonoriza.com/musics/masada.mp3',
      album: null,
      coverPath: null,
      color: null,
      durationSec: null,
      releaseDate: null,
      genreId,
      artistIds: [artistId],
    })

    await expect(
      useCase.execute({
        title: 'Masada 2',
        slug: 'masada',
        audioPath: 'https://cdn.sonoriza.com/musics/masada-2.mp3',
        album: null,
        coverPath: null,
        color: null,
        durationSec: null,
        releaseDate: null,
        genreId,
        artistIds: [artistId],
      }),
    ).rejects.toBeInstanceOf(MusicSlugAlreadyExistsError)
  })

  it('should throw when genre does not exist', async () => {
    const artistId = randomUUID()

    const musicRepo = new InMemoryMusicRepository()
    const artistsRepo = new InMemoryArtistsRepository()
    const genresRepo = new InMemoryGenresRepository()

    await artistsRepo.create(
      new Artist(
        artistId,
        'Djonga',
        'https://cdn.sonoriza.com/artists/djonga.jpg',
        0,
      ),
    )

    const useCase = new CreateMusicUseCase(musicRepo, artistsRepo, genresRepo)

    await expect(
      useCase.execute({
        title: 'Masada',
        slug: 'masada',
        audioPath: 'https://cdn.sonoriza.com/musics/masada.mp3',
        album: null,
        coverPath: null,
        color: null,
        durationSec: null,
        releaseDate: null,
        genreId: randomUUID(),
        artistIds: [artistId],
      }),
    ).rejects.toBeInstanceOf(GenreNotFoundError)
  })

  it('should throw when artist does not exist', async () => {
    const genreId = randomUUID()

    const musicRepo = new InMemoryMusicRepository()
    const artistsRepo = new InMemoryArtistsRepository()
    const genresRepo = new InMemoryGenresRepository()

    await genresRepo.create(new Genre(genreId, 'Rap'))

    const useCase = new CreateMusicUseCase(musicRepo, artistsRepo, genresRepo)

    await expect(
      useCase.execute({
        title: 'Masada',
        slug: 'masada',
        audioPath: 'https://cdn.sonoriza.com/musics/masada.mp3',
        album: null,
        coverPath: null,
        color: null,
        durationSec: null,
        releaseDate: null,
        genreId,
        artistIds: [randomUUID()],
      }),
    ).rejects.toBeInstanceOf(ArtistNotFoundError)
  })
})
