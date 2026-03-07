import { Body, Controller, Post, UseGuards } from '@nestjs/common'
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
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { CreateMusicRequestSwaggerDTO } from '../../swagger/musics/create-music-request.swagger.dto'
import { MusicResponseSwaggerDTO } from '../../swagger/musics/music-response.swagger.dto'
import { MusicPresenter } from '../../presenters/music.presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'

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
    durationSec: z.number().nullable().optional(),
    releaseDate: z.coerce.date().nullable().optional(),
    genreId: z.string().nullable().optional(),
    artistIds: z.array(z.string()).optional(),
  })
  .refine((data) => Boolean(data.audioPath ?? data.url), {
    message: 'audioPath or url is required',
    path: ['audioPath'],
  })
  .strict()

type CreateMusicBody = z.infer<typeof createMusicSchema>

const bodyValidationPipe = new ZodValidationPipe(createMusicSchema)

@ApiTags('Musics')
@Controller('/musics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class CreateMusicController {
  constructor(private createMusicUseCase: CreateMusicUseCase) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new music' })
  @ApiBody({ type: CreateMusicRequestSwaggerDTO })
  @ApiCreatedResponse({
    description: 'Music created successfully',
    type: MusicResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
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
      durationSec: body.durationSec ?? null,
      releaseDate: body.releaseDate ?? null,
      genreId: body.genreId ?? null,
      artistIds: body.artistIds ?? [],
    }

    const created = await this.createMusicUseCase.execute(dto)

    return MusicPresenter.toHTTP(created)
  }
}
