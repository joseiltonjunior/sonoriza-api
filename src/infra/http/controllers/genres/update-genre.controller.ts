import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UpdateGenreUseCase } from '@/domain/genres/use-cases/update-genre.use-case'
import { UpdateGenreDTO } from '@/domain/genres/dtos/update-genre.dto'

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
  ApiConflictResponse,
} from '@nestjs/swagger'
import { UpdateGenreRequestSwaggerDTO } from '../../swagger/genres/update-genre-request.swagger.dto'
import { UpdateGenreResponseSwaggerDTO } from '../../swagger/genres/update-genre-response.swagger.dto'
import { GenrePresenter } from '../../presenters/genre.presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'

const bodySchema = z.object({
  name: z.string().min(1).optional(),
})

type UpdateGenreBody = z.infer<typeof bodySchema>

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

@ApiTags('Genres')
@Controller('/genres')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UpdateGenreController {
  constructor(private updateGenreUseCase: UpdateGenreUseCase) {}

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a genre' })
  @ApiParam({
    name: 'id',
    example: 'genre-id-uuid',
  })
  @ApiBody({
    type: UpdateGenreRequestSwaggerDTO,
  })
  @ApiOkResponse({
    description: 'Genre updated successfully',
    type: UpdateGenreResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiNotFoundResponse({
    description: 'Genre not found',
  })
  @ApiConflictResponse({ description: 'Genre name already exists' })
  @ApiBadRequestResponse({
    description: 'Invalid payload',
  })
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateGenreBody,
  ) {
    const dto: UpdateGenreDTO = {
      name: body.name,
    }

    const updated = await this.updateGenreUseCase.execute(id, dto)

    return GenrePresenter.toHTTP(updated)
  }
}
