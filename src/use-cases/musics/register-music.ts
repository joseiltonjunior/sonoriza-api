import { MusicsRepository } from '@/repositories/musics-repository'

import { Music } from '@prisma/client'

interface registerMusicRequest {
  album: string
  title: string
  artwork: string
  color: string
  url: string
  musicalGenreId: string
  artistsId: string[]
}

interface RegisterMusicUseCaseResponse {
  music: Music
}

export class RegisterMusicUseCase {
  constructor(private musicRepository: MusicsRepository) {}

  async execute({
    album,
    artwork,
    title,
    color,
    url,
    musicalGenreId,
    artistsId,
  }: registerMusicRequest): Promise<RegisterMusicUseCaseResponse> {
    const music = await this.musicRepository.create({
      album,
      artwork,
      color,
      url,
      title,
      artists: artistsId,
      musicalGenre: musicalGenreId,
    })

    return { music }
  }
}
