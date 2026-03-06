import { ArtistNotFoundError } from '../errors/artist-not-found.error'
import { ArtistsRepository } from '../repositories/artists-repository'

export class DeleteArtistUseCase {
  constructor(private artistsRepository: ArtistsRepository) {}

  async execute(id: string) {
    const artist = await this.artistsRepository.findById(id)

    if (!artist) {
      throw new ArtistNotFoundError()
    }

    artist.softDelete()

    await this.artistsRepository.update(artist)
  }
}
