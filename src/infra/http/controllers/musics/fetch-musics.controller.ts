import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { FetchMusicsDTO } from '@/domain/musics/dtos/fetch-musics.dto'
import { FetchMusicsUseCase } from '@/domain/musics/use-cases/fetch-music.use-case'

import { ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger'
import { FetchMusicsResponseSwaggerDTO } from '../../swagger/musics/fetch-musics-response.swagger.dto'

const fetchMusicsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

type FetchMusicsQuery = z.infer<typeof fetchMusicsQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchMusicsQuerySchema)

@ApiTags('Musics')
@Controller('/musics')
export class FetchMusicsController {
  constructor(private fetchMusicsUseCase: FetchMusicsUseCase) {}

  @Get()
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
  async handle(@Query(queryValidationPipe) query: FetchMusicsQuery) {
    const dto: FetchMusicsDTO = {
      page: query.page,
    }

    return this.fetchMusicsUseCase.execute(dto)
  }
}
