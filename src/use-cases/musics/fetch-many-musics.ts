import {
  MusicsPaginated,
  MusicsRepository,
} from '@/repositories/musics-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FetchManyMusicUseCaseRequest {
  page: number
}

type FetchManyMusicUseCaseResponse = MusicsPaginated

export class FetchManyMusicUseCase {
  constructor(private musicRepository: MusicsRepository) {}

  async execute({
    page,
  }: FetchManyMusicUseCaseRequest): Promise<FetchManyMusicUseCaseResponse> {
    const musics = await this.musicRepository.findManyByPaginated(page)

    if (!musics) {
      throw new ResourceNotFoundError()
    }

    return musics
  }
}
