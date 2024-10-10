import { MusicsRepository } from '@/repositories/musics-repository'

import { Music } from '@prisma/client'

import { UserNotExistsError } from '../errors/user-not-exists'

interface FetchMusicUseCaseRequest {
  id: string
}

interface FetchMusicUseCaseResponse {
  music: Music
}

export class FetchMusicUseCase {
  constructor(private musicRepository: MusicsRepository) {}

  async execute({
    id,
  }: FetchMusicUseCaseRequest): Promise<FetchMusicUseCaseResponse> {
    const music = await this.musicRepository.findById(id)

    if (!music) {
      throw new UserNotExistsError()
    }

    return {
      music,
    }
  }
}
