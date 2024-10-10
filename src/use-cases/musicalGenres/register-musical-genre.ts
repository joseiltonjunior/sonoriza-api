import { MusicalGenresRepository } from '@/repositories/musical-genres-repository'

import { MusicalGenre } from '@prisma/client'
import { MusicalGenreAlreadyExistError } from '../errors/musical-genre-already-exists-error'

interface RegisterMusicalGenreUseCaseRequest {
  name: string
}

interface RegisterMusicalGenreUseCaseResponse {
  musicalGenre: MusicalGenre
}

export class RegisterMusicalGenreUseCase {
  constructor(private musicalGenreRepository: MusicalGenresRepository) {}

  async execute({
    name,
  }: RegisterMusicalGenreUseCaseRequest): Promise<RegisterMusicalGenreUseCaseResponse> {
    const musicalGenreExists =
      await this.musicalGenreRepository.findByName(name)

    if (musicalGenreExists) {
      throw new MusicalGenreAlreadyExistError()
    }

    const musicalGenre = await this.musicalGenreRepository.create({
      name,
    })

    return {
      musicalGenre,
    }
  }
}
