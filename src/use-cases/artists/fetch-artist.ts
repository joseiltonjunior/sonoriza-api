import { ArtistsRepository } from '@/repositories/artists-repository'

import { Artist } from '@prisma/client'

import { UserNotExistsError } from '../errors/user-not-exists'

interface FetchArtistUseCaseRequest {
  id: string
}

interface FetchArtistUseCaseResponse {
  artist: Artist
}

export class FetchArtistUseCase {
  constructor(private artistRepository: ArtistsRepository) {}

  async execute({
    id,
  }: FetchArtistUseCaseRequest): Promise<FetchArtistUseCaseResponse> {
    const artist = await this.artistRepository.findById(id)

    if (!artist) {
      throw new UserNotExistsError()
    }

    return {
      artist,
    }
  }
}
