import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateMusicUseCase } from '@/domain/musics/use-cases/create-music.use-case'
import { CreateMusicDTO } from '@/domain/musics/dtos/create-music.dto'

import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
} from '@nestjs/swagger'
import { CreateMusicRequestSwaggerDTO } from '../../swagger/musics/create-music-request.swagger.dto'

const createMusicSchema = z.object({
  title: z.string(),
  slug: z.string(),
  audioPath: z.string(),
  album: z.string().nullable().optional(),
  coverPath: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  durationSec: z.number().nullable().optional(),
  releaseDate: z.coerce.date().nullable().optional(),
  genreId: z.string().nullable().optional(),
})

type CreateMusicBody = z.infer<typeof createMusicSchema>

const bodyValidationPipe = new ZodValidationPipe(createMusicSchema)

@ApiTags('Musics')
@Controller('/musics')
export class CreateMusicController {
  constructor(private createMusicUseCase: CreateMusicUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new music' })
  @ApiBody({ type: CreateMusicRequestSwaggerDTO })
  @ApiCreatedResponse({ description: 'Music created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  async handle(@Body(bodyValidationPipe) body: CreateMusicBody) {
    const dto: CreateMusicDTO = {
      title: body.title,
      slug: body.slug,
      audioPath: body.audioPath,
      album: body.album ?? null,
      coverPath: body.coverPath ?? null,
      color: body.color ?? null,
      durationSec: body.durationSec ?? null,
      releaseDate: body.releaseDate ?? null,
      genreId: body.genreId ?? null,
    }

    const created = await this.createMusicUseCase.execute(dto)

    return {
      id: created.id,
      title: created.title,
      slug: created.slug,
    }
  }
}
