import { FetchMusicsDTO } from '../dtos/fetch-musics.dto'
import { MusicRepository } from '../repositories/music-repository'

import { FetchMusicsResponseDTO } from '../dtos/fetch-musics-response.dto'

export class FetchMusicsUseCase {
  constructor(private musicRepository: MusicRepository) {}

  async execute({ page, artistId }: FetchMusicsDTO): Promise<FetchMusicsResponseDTO> {
    const limit = 20

    const { data, total } = await this.musicRepository.findMany({
      page,
      limit,
      artistId,
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
