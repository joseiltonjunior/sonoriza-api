import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchArtistsDTO } from '@/domain/artists/dtos/fetch-artists.dto'
import { FetchArtistsUseCase } from '@/domain/artists/use-cases/fetch-artists.use-case'

import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { FetchArtistsResponseSwaggerDTO } from '../../swagger/artists/fetch-artists-response.swagger.dto'
import { ArtistPresenter } from '../../presenters/artist.presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed === '' ? undefined : trimmed
}, z.string().min(1).optional())

const fetchArtistsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  name: optionalTrimmedString,
  genreId: z.uuid().optional(),
})

type FetchArtistsQuery = z.infer<typeof fetchArtistsQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchArtistsQuerySchema)

@ApiTags('Artists')
@Controller('/artists')
@UseGuards(JwtAuthGuard)
export class FetchArtistsController {
  constructor(private fetchArtistsUseCase: FetchArtistsUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch paginated artists',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    example: 'natan',
    description: 'Filter artists by name',
  })
  @ApiQuery({
    name: 'genreId',
    required: false,
    example: 'af7b8307-19a6-4474-a10d-b6ae8a06f66f',
    description: 'Filter artists by genre id',
  })
  @ApiOkResponse({
    description: 'Paginated list of artists',
    type: FetchArtistsResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async handle(@Query(queryValidationPipe) query: FetchArtistsQuery) {
    const dto: FetchArtistsDTO = {
      page: query.page,
      name: query.name,
      genreId: query.genreId,
    }

    const response = await this.fetchArtistsUseCase.execute(dto)

    return {
      data: response.data.map(ArtistPresenter.toHTTP),
      meta: response.meta,
    }
  }
}
