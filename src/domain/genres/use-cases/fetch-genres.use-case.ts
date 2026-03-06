import { FetchGenresDTO } from '../dtos/fetch-genres.dto'
import { GenresRepository } from '../repositories/genres-repository'
import { FetchGenresResponseDTO } from '../dtos/fetch-genres-response.dto'

export class FetchGenresUseCase {
  constructor(private genresRepository: GenresRepository) {}

  async execute({ page }: FetchGenresDTO): Promise<FetchGenresResponseDTO> {
    const limit = 20

    const { data, total } = await this.genresRepository.findMany({
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
