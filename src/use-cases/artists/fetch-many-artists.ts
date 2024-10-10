import {
  ArtistsPaginated,
  ArtistsRepository,
} from '@/repositories/artists-repository'

import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FetchManyArtistsUseCaseRequest {
  page: number
}

type FetchManyArtistsUseCaseResponse = ArtistsPaginated

export class FetchManyArtistsUseCase {
  constructor(private artistsRepository: ArtistsRepository) {}

  async execute({
    page,
  }: FetchManyArtistsUseCaseRequest): Promise<FetchManyArtistsUseCaseResponse> {
    const artists = await this.artistsRepository.findManyByPaginated(page)

    if (!artists) {
      throw new ResourceNotFoundError()
    }

    return artists
  }
}
