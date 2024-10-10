import { ArtistsRepository } from '@/repositories/artists-repository'

import { Artist } from '@prisma/client'
import { UserNotExistsError } from '../errors/user-not-exists'

interface EditArtistRequest {
  name: string
  photoURL: string
  id: string
}

interface EditArtistUseCaseResponse {
  artist: Artist
}

export class EditArtistUseCase {
  constructor(private artistRepository: ArtistsRepository) {}

  async execute({
    name,
    photoURL,
    id,
  }: EditArtistRequest): Promise<EditArtistUseCaseResponse> {
    const artistExist = await this.artistRepository.findById(id)

    if (!artistExist) {
      throw new UserNotExistsError()
    }

    const artist = await this.artistRepository.edit({
      name,
      photoURL,
      id,
    })

    return {
      artist,
    }
  }
}
