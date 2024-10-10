import { MusicsRepository } from '@/repositories/musics-repository'

import { Music } from '@prisma/client'

interface EditMusicRequest {
  album: string
  title: string
  artwork: string
  color: string
  url: string
  id: string
  musicalGenre: string
}

interface EditMusicUseCaseResponse {
  music: Music
}

export class EditMusicUseCase {
  constructor(private musicRepository: MusicsRepository) {}

  async execute({
    album,
    artwork,
    color,
    title,
    id,
    url,
    musicalGenre,
  }: EditMusicRequest): Promise<EditMusicUseCaseResponse> {
    const music = await this.musicRepository.edit({
      album,
      artwork,
      id,
      url,
      color,
      title,
      musicalGenre,
    })

    return {
      music,
    }
  }
}
