import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateGenreUseCase } from '@/domain/genres/use-cases/create-genre.use-case'
import { CreateGenreDTO } from '@/domain/genres/dtos/create-genre.dto'

import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { CreateGenreRequestSwaggerDTO } from '../../swagger/genres/create-genre-request.swagger.dto'
import { CreateGenreResponseSwaggerDTO } from '../../swagger/genres/create-genre-response.swagger.dto'
import { GenrePresenter } from '../../presenters/genre.presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'

const createGenreSchema = z.object({
  name: z.string().min(1),
})

type CreateGenreBody = z.infer<typeof createGenreSchema>

const bodyValidationPipe = new ZodValidationPipe(createGenreSchema)

@ApiTags('Genres')
@Controller('/genres')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class CreateGenreController {
  constructor(private createGenreUseCase: CreateGenreUseCase) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiBody({ type: CreateGenreRequestSwaggerDTO })
  @ApiCreatedResponse({
    description: 'Genre created successfully',
    type: CreateGenreResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiConflictResponse({ description: 'Genre name already exists' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  async handle(@Body(bodyValidationPipe) body: CreateGenreBody) {
    const dto: CreateGenreDTO = {
      name: body.name,
    }

    const created = await this.createGenreUseCase.execute(dto)

    return GenrePresenter.toHTTP(created)
  }
}
