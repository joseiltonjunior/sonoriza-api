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
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger'
import { CreateMusicRequestSwaggerDTO } from '../../swagger/musics/create-music-request.swagger.dto'
import { MusicResponseSwaggerDTO } from '../../swagger/musics/music-response.swagger.dto'
import { MusicPresenter } from '../../presenters/music.presenter'

const createMusicSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    audioPath: z.string().optional(),
    url: z.string().optional(),
    album: z.string().nullable().optional(),
    coverPath: z.string().nullable().optional(),
    artwork: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
    like: z.number().int().min(0).nullable().optional(),
    view: z.number().int().min(0).nullable().optional(),
    durationSec: z.number().nullable().optional(),
    releaseDate: z.coerce.date().nullable().optional(),
    genreId: z.string().nullable().optional(),
    artistIds: z.array(z.string()).optional(),
  })
  .refine((data) => Boolean(data.audioPath ?? data.url), {
    message: 'audioPath or url is required',
    path: ['audioPath'],
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
  @ApiCreatedResponse({
    description: 'Music created successfully',
    type: MusicResponseSwaggerDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiNotFoundResponse({ description: 'Artist or genre not found' })
  @ApiConflictResponse({ description: 'Slug already exists' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  async handle(@Body(bodyValidationPipe) body: CreateMusicBody) {
    const dto: CreateMusicDTO = {
      title: body.title,
      slug: body.slug,
      audioPath: body.audioPath ?? body.url!,
      album: body.album ?? null,
      coverPath: body.coverPath ?? body.artwork ?? null,
      color: body.color ?? null,
      like: body.like ?? null,
      view: body.view ?? null,
      durationSec: body.durationSec ?? null,
      releaseDate: body.releaseDate ?? null,
      genreId: body.genreId ?? null,
      artistIds: body.artistIds ?? [],
    }

    const created = await this.createMusicUseCase.execute(dto)

    return MusicPresenter.toHTTP(created)
  }
}
