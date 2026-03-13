import { FetchArtistsDTO } from '../dtos/fetch-artists.dto'
import { FetchArtistsResponseDTO } from '../dtos/fetch-artists-response.dto'
import { ArtistsRepository } from '../repositories/artists-repository'

export class FetchArtistsUseCase {
  constructor(private artistsRepository: ArtistsRepository) {}

  async execute({
    page,
    name,
    genreId,
  }: FetchArtistsDTO): Promise<FetchArtistsResponseDTO> {
    const limit = 20

    const { data, total } = await this.artistsRepository.findMany({
      page,
      limit,
      name,
      genreId,
    })

    const lastPage = Math.ceil(total / limit)

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
      },
    }
  }
}
