import { UpdateArtistDTO } from '../dtos/update-artist.dto'
import { ArtistNotFoundError } from '../errors/artist-not-found.error'
import { ArtistsRepository } from '../repositories/artists-repository'

export class UpdateArtistUseCase {
  constructor(private artistsRepository: ArtistsRepository) {}

  async execute(id: string, data: UpdateArtistDTO) {
    const artist = await this.artistsRepository.findById(id)

    if (!artist) {
      throw new ArtistNotFoundError()
    }

    artist.update(data)

    await this.artistsRepository.update(artist)

    const persisted = await this.artistsRepository.findById(id)

    return persisted ?? artist
  }
}
