import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { FetchMusicsDTO } from '@/domain/musics/dtos/fetch-musics.dto'
import { FetchMusicsUseCase } from '@/domain/musics/use-cases/fetch-music.use-case'

import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { FetchMusicsResponseSwaggerDTO } from '../../swagger/musics/fetch-musics-response.swagger.dto'
import { MusicPresenter } from '../../presenters/music.presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed === '' ? undefined : trimmed
}, z.string().min(1).optional())

const fetchMusicsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  artistId: z.uuid().optional(),
  title: optionalTrimmedString,
  album: optionalTrimmedString,
})

type FetchMusicsQuery = z.infer<typeof fetchMusicsQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchMusicsQuerySchema)

@ApiTags('Musics')
@Controller('/musics')
@UseGuards(JwtAuthGuard)
export class FetchMusicsController {
  constructor(private fetchMusicsUseCase: FetchMusicsUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch paginated musics',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'artistId',
    required: false,
    example: '67502595-593c-4ada-8f2c-b6cd6a743f61',
    description: 'Filter musics by artist id',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    example: 'sonho',
    description: 'Filter musics by title',
  })
  @ApiQuery({
    name: 'album',
    required: false,
    example: 'best of',
    description: 'Filter musics by album',
  })
  @ApiOkResponse({
    description: 'Paginated list of musics',
    type: FetchMusicsResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async handle(@Query(queryValidationPipe) query: FetchMusicsQuery) {
    const dto: FetchMusicsDTO = {
      page: query.page,
      artistId: query.artistId,
      title: query.title,
      album: query.album,
    }

    const response = await this.fetchMusicsUseCase.execute(dto)

    return {
      data: response.data.map(MusicPresenter.toHTTP),
      meta: response.meta,
    }
  }
}
