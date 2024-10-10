import { MusicalGenresRepository } from '@/repositories/musical-genres-repository'

import { MusicalGenre } from '@prisma/client'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface EditMusicalGenreUseCaseRequest {
  name: string
  id: string
}

interface EditMusicalGenreUseCaseResponse {
  musicalGenre: MusicalGenre
}

export class EditMusicalGenreUseCase {
  constructor(private musicalGenreRepository: MusicalGenresRepository) {}

  async execute({
    name,
    id,
  }: EditMusicalGenreUseCaseRequest): Promise<EditMusicalGenreUseCaseResponse> {
    const musicalGenreExists = await this.musicalGenreRepository.findById(id)

    if (!musicalGenreExists) {
      throw new ResourceNotFoundError()
    }

    const musicalGenre = await this.musicalGenreRepository.edit({
      name,
      id,
    })

    return {
      musicalGenre,
    }
  }
}
