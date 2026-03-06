import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchArtistsDTO } from '@/domain/artists/dtos/fetch-artists.dto'
import { FetchArtistsUseCase } from '@/domain/artists/use-cases/fetch-artists.use-case'

import { ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger'
import { FetchArtistsResponseSwaggerDTO } from '../../swagger/artists/fetch-artists-response.swagger.dto'
import { ArtistPresenter } from '../../presenters/artist.presenter'

const fetchArtistsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

type FetchArtistsQuery = z.infer<typeof fetchArtistsQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchArtistsQuerySchema)

@ApiTags('Artists')
@Controller('/artists')
export class FetchArtistsController {
  constructor(private fetchArtistsUseCase: FetchArtistsUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch paginated artists',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Paginated list of artists',
    type: FetchArtistsResponseSwaggerDTO,
  })
  async handle(@Query(queryValidationPipe) query: FetchArtistsQuery) {
    const dto: FetchArtistsDTO = {
      page: query.page,
    }

    const response = await this.fetchArtistsUseCase.execute(dto)

    return {
      data: response.data.map(ArtistPresenter.toHTTP),
      meta: response.meta,
    }
  }
}
