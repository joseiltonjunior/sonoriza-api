import { ArtistNotFoundError } from '../errors/artist-not-found.error'
import { ArtistsRepository } from '../repositories/artists-repository'

export class GetArtistByIdUseCase {
  constructor(private readonly artistsRepository: ArtistsRepository) {}

  async execute(id: string) {
    const artist = await this.artistsRepository.findById(id)

    if (!artist) {
      throw new ArtistNotFoundError()
    }

    return artist
  }
}
