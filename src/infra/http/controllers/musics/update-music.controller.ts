import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
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
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { UpdateMusicRequestSwaggerDTO } from '../../swagger/musics/update-music-request.swagger.dto'
import { UpdateMusicResponseSwaggerDTO } from '../../swagger/musics/update-music-response.swagger.dto'
import { MusicPresenter } from '../../presenters/music.presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'

const bodySchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  audioPath: z.string().optional(),
  url: z.string().optional(),
  album: z.string().nullable().optional(),
  coverPath: z.string().nullable().optional(),
  artwork: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  like: z.number().int().min(0).optional(),
  view: z.number().int().min(0).optional(),
  durationSec: z.number().nullable().optional(),
  releaseDate: z.coerce.date().nullable().optional(),
  genreId: z.string().nullable().optional(),
  artistIds: z.array(z.string()).optional(),
})

type UpdateMusicBody = z.infer<typeof bodySchema>

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

@ApiTags('Musics')
@Controller('/musics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UpdateMusicController {
  constructor(private updateMusicUseCase: UpdateMusicUseCase) {}

  @Patch(':id')
  @ApiBearerAuth()
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
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
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
      title: body.title,
      slug: body.slug,
      audioPath: body.audioPath ?? body.url,
      album: body.album,
      coverPath: body.coverPath ?? body.artwork,
      color: body.color,
      like: body.like,
      view: body.view,
      durationSec: body.durationSec,
      releaseDate: body.releaseDate,
      genreId: body.genreId,
      artistIds: body.artistIds,
    }

    const updated = await this.updateMusicUseCase.execute(id, dto)

    return MusicPresenter.toHTTP(updated)
  }
}
