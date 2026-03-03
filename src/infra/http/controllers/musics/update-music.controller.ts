import { Body, Controller, Param, Patch } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UpdateMusicUseCase } from '@/domain/musics/use-cases/update-music.use-case'
import { UpdateMusicDTO } from '@/domain/musics/dtos/update-music.dto'

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { UpdateMusicRequestSwaggerDTO } from '../../swagger/musics/update-music-request.swagger.dto'
import { UpdateMusicResponseSwaggerDTO } from '../../swagger/musics/update-music-response.swagger.dto'

const bodySchema = z.object({
  title: z.string().optional(),
  album: z.string().nullable().optional(),
  coverPath: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  durationSec: z.number().nullable().optional(),
  releaseDate: z.coerce.date().nullable().optional(),
  genreId: z.string().nullable().optional(),
})

type UpdateMusicBody = z.infer<typeof bodySchema>

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

@ApiTags('Musics')
@Controller('/musics')
export class UpdateMusicController {
  constructor(private updateMusicUseCase: UpdateMusicUseCase) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update a music' })
  @ApiParam({
    name: 'id',
    example: 'uuid-da-musica',
  })
  @ApiBody({
    type: UpdateMusicRequestSwaggerDTO,
  })
  @ApiOkResponse({
    description: 'Music updated successfully',
    type: UpdateMusicResponseSwaggerDTO,
  })
  @ApiNotFoundResponse({
    description: 'Music not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload',
  })
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateMusicBody,
  ) {
    const dto: UpdateMusicDTO = {
      ...body,
    }

    const updated = await this.updateMusicUseCase.execute(id, dto)

    return {
      id: updated.id,
      title: updated.title,
      slug: updated.slug,
    }
  }
}
