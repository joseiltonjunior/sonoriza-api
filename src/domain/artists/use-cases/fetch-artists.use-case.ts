import { FetchArtistsDTO } from '../dtos/fetch-artists.dto'
import { ArtistsRepository } from '../repositories/artists-repository'
import { FetchArtistsResponseDTO } from '../dtos/fetch-artists-response.dto'

export class FetchArtistsUseCase {
  constructor(private artistsRepository: ArtistsRepository) {}

  async execute({ page }: FetchArtistsDTO): Promise<FetchArtistsResponseDTO> {
    const limit = 20

    const { data, total } = await this.artistsRepository.findMany({
      page,
      limit,
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
