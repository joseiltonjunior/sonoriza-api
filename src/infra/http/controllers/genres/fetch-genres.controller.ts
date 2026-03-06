import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchGenresDTO } from '@/domain/genres/dtos/fetch-genres.dto'
import { FetchGenresUseCase } from '@/domain/genres/use-cases/fetch-genres.use-case'

import { ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger'
import { FetchGenresResponseSwaggerDTO } from '../../swagger/genres/fetch-genres-response.swagger.dto'
import { GenrePresenter } from '../../presenters/genre.presenter'

const fetchGenresQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

type FetchGenresQuery = z.infer<typeof fetchGenresQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchGenresQuerySchema)

@ApiTags('Genres')
@Controller('/genres')
export class FetchGenresController {
  constructor(private fetchGenresUseCase: FetchGenresUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch paginated genres',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Paginated list of genres',
    type: FetchGenresResponseSwaggerDTO,
  })
  async handle(@Query(queryValidationPipe) query: FetchGenresQuery) {
    const dto: FetchGenresDTO = {
      page: query.page,
    }

    const response = await this.fetchGenresUseCase.execute(dto)

    return {
      data: response.data.map(GenrePresenter.toHTTP),
      meta: response.meta,
    }
  }
}
