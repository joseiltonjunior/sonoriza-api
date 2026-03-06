import { randomUUID } from 'node:crypto'
import { CreateArtistDTO } from '../dtos/create-artist.dto'
import { Artist } from '../entities/artist'
import { ArtistsRepository } from '../repositories/artists-repository'

export class CreateArtistUseCase {
  constructor(private artistsRepository: ArtistsRepository) {}

  async execute(data: CreateArtistDTO): Promise<Artist> {
    const artist = new Artist(
      randomUUID(),
      data.name,
      data.photoURL,
      data.like ?? 0,
    )

    await this.artistsRepository.create(artist)

    const persisted = await this.artistsRepository.findById(artist.id)

    return persisted ?? artist
  }
}
