import { FetchMusicsDTO } from '../dtos/fetch-musics.dto'
import { FetchMusicsResponseDTO } from '../dtos/fetch-musics-response.dto'
import { MusicRepository } from '../repositories/music-repository'

export class FetchMusicsUseCase {
  constructor(private musicRepository: MusicRepository) {}

  async execute({
    page,
    artistId,
    title,
    album,
  }: FetchMusicsDTO): Promise<FetchMusicsResponseDTO> {
    const limit = 20

    const { data, total } = await this.musicRepository.findMany({
      page,
      limit,
      artistId,
      title,
      album,
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
