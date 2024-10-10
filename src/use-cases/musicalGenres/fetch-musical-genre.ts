import { MusicalGenresRepository } from '@/repositories/musical-genres-repository'
import { MusicalGenre } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FetchMusicalGenreUseCaseRequest {
  id: string
}

interface FetchMusicalGenreUseCaseResponse {
  musicalGenre: MusicalGenre
}

export class FetchMusicalGenreUseCase {
  constructor(private musicalGenresRepository: MusicalGenresRepository) {}

  async execute({
    id,
  }: FetchMusicalGenreUseCaseRequest): Promise<FetchMusicalGenreUseCaseResponse> {
    const musicalGenre = await this.musicalGenresRepository.findById(id)

    if (!musicalGenre) {
      throw new ResourceNotFoundError()
    }

    return {
      musicalGenre,
    }
  }
}
