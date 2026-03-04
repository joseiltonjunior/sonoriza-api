import { randomUUID } from 'node:crypto'

import { CreateMusicUseCase } from './create-music.use-case'
import { MusicSlugAlreadyExistsError } from '../errors/music-slug-already-exists.error'
import { GenreNotFoundError } from '../errors/genre-not-found.error'
import { ArtistNotFoundError } from '../errors/artist-not-found.error'
import { InMemoryMusicRepository } from '../repositories/in-memory-music.repository'
import { ArtistRepository } from '../repositories/artist-repository'
import { GenreRepository } from '../repositories/genre-repository'

class InMemoryArtistRepository implements ArtistRepository {
  constructor(private ids: string[] = []) {}

  async findById(id: string): Promise<{ id: string } | null> {
    return this.ids.includes(id) ? { id } : null
  }
}

class InMemoryGenreRepository implements GenreRepository {
  constructor(private ids: string[] = []) {}

  async findById(id: string): Promise<{ id: string } | null> {
    return this.ids.includes(id) ? { id } : null
  }
}

describe('CreateMusicUseCase', () => {
  it('should create a new music', async () => {
    const artistId = randomUUID()
    const genreId = randomUUID()

    const musicRepo = new InMemoryMusicRepository()
    const artistRepo = new InMemoryArtistRepository([artistId])
    const genreRepo = new InMemoryGenreRepository([genreId])
    const useCase = new CreateMusicUseCase(musicRepo, artistRepo, genreRepo)

    const result = await useCase.execute({
      title: 'Masada',
      slug: 'masada',
      audioPath: 'https://cdn.sonoriza.com/musics/masada.mp3',
      album: 'Best Of',
      coverPath: 'https://cdn.sonoriza.com/covers/masada.jpg',
      color: '#c53a27',
      like: 10,
      view: 250,
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
      }),
    )

    expect(musicRepo.items.length).toBe(1)
  })

  it('should not allow creating a music with duplicated slug', async () => {
    const artistId = randomUUID()
    const genreId = randomUUID()

    const musicRepo = new InMemoryMusicRepository()
    const artistRepo = new InMemoryArtistRepository([artistId])
    const genreRepo = new InMemoryGenreRepository([genreId])
    const useCase = new CreateMusicUseCase(musicRepo, artistRepo, genreRepo)

    await useCase.execute({
      title: 'Masada',
      slug: 'masada',
      audioPath: 'https://cdn.sonoriza.com/musics/masada.mp3',
      album: null,
      coverPath: null,
      color: null,
      like: null,
      view: null,
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
        like: null,
        view: null,
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
    const artistRepo = new InMemoryArtistRepository([artistId])
    const genreRepo = new InMemoryGenreRepository([])
    const useCase = new CreateMusicUseCase(musicRepo, artistRepo, genreRepo)

    await expect(
      useCase.execute({
        title: 'Masada',
        slug: 'masada',
        audioPath: 'https://cdn.sonoriza.com/musics/masada.mp3',
        album: null,
        coverPath: null,
        color: null,
        like: null,
        view: null,
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
    const artistRepo = new InMemoryArtistRepository([])
    const genreRepo = new InMemoryGenreRepository([genreId])
    const useCase = new CreateMusicUseCase(musicRepo, artistRepo, genreRepo)

    await expect(
      useCase.execute({
        title: 'Masada',
        slug: 'masada',
        audioPath: 'https://cdn.sonoriza.com/musics/masada.mp3',
        album: null,
        coverPath: null,
        color: null,
        like: null,
        view: null,
        durationSec: null,
        releaseDate: null,
        genreId,
        artistIds: [randomUUID()],
      }),
    ).rejects.toBeInstanceOf(ArtistNotFoundError)
  })
})
