import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateArtistUseCase } from '@/domain/artists/use-cases/create-artist.use-case'
import { CreateArtistDTO } from '@/domain/artists/dtos/create-artist.dto'

import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { CreateArtistRequestSwaggerDTO } from '../../swagger/artists/create-artist-request.swagger.dto'
import { CreateArtistResponseSwaggerDTO } from '../../swagger/artists/create-artist-response.swagger.dto'
import { ArtistPresenter } from '../../presenters/artist.presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'

const createArtistSchema = z.object({
  name: z.string(),
  photoURL: z.url(),
  like: z.number().int().min(0).nullable().optional(),
})

type CreateArtistBody = z.infer<typeof createArtistSchema>

const bodyValidationPipe = new ZodValidationPipe(createArtistSchema)

@ApiTags('Artists')
@Controller('/artists')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class CreateArtistController {
  constructor(private createArtistUseCase: CreateArtistUseCase) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new artist' })
  @ApiBody({ type: CreateArtistRequestSwaggerDTO })
  @ApiCreatedResponse({
    description: 'Artist created successfully',
    type: CreateArtistResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  async handle(@Body(bodyValidationPipe) body: CreateArtistBody) {
    const dto: CreateArtistDTO = {
      name: body.name,
      photoURL: body.photoURL,
      like: body.like ?? null,
    }

    const created = await this.createArtistUseCase.execute(dto)

    return ArtistPresenter.toHTTP(created)
  }
}
