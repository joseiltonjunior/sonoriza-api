import { ArtistsRepository } from '@/repositories/artists-repository'

import { Artist } from '@prisma/client'

interface registerArtistRequest {
  name: string
  photoURL: string
}

interface RegisterArtistUseCaseResponse {
  artist: Artist
}

export class RegisterArtistUseCase {
  constructor(private artistRepository: ArtistsRepository) {}

  async execute({
    name,
    photoURL,
  }: registerArtistRequest): Promise<RegisterArtistUseCaseResponse> {
    const artist = await this.artistRepository.create({
      photoURL,
      name,
      likes: 0,
    })

    return { artist }
  }
}
