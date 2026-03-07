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

const fetchMusicsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
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
  @ApiOkResponse({
    description: 'Paginated list of musics',
    type: FetchMusicsResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async handle(@Query(queryValidationPipe) query: FetchMusicsQuery) {
    const dto: FetchMusicsDTO = {
      page: query.page,
    }

    const response = await this.fetchMusicsUseCase.execute(dto)

    return {
      data: response.data.map(MusicPresenter.toHTTP),
      meta: response.meta,
    }
  }
}
