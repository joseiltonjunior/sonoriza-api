import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UpdateArtistUseCase } from '@/domain/artists/use-cases/update-artist.use-case'
import { UpdateArtistDTO } from '@/domain/artists/dtos/update-artist.dto'

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
import { UpdateArtistRequestSwaggerDTO } from '../../swagger/artists/update-artist-request.swagger.dto'
import { UpdateArtistResponseSwaggerDTO } from '../../swagger/artists/update-artist-response.swagger.dto'
import { ArtistPresenter } from '../../presenters/artist.presenter'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'

const bodySchema = z
  .object({
    name: z.string().optional(),
    photoURL: z.url().optional(),
    genreIds: z.array(z.uuid()).optional(),
  })
  .strict()

type UpdateArtistBody = z.infer<typeof bodySchema>

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

@ApiTags('Artists')
@Controller('/artists')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UpdateArtistController {
  constructor(private updateArtistUseCase: UpdateArtistUseCase) {}

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an artist' })
  @ApiParam({
    name: 'id',
    example: 'artist-id-uuid',
  })
  @ApiBody({
    type: UpdateArtistRequestSwaggerDTO,
  })
  @ApiOkResponse({
    description: 'Artist updated successfully',
    type: UpdateArtistResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiNotFoundResponse({
    description: 'Artist not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload',
  })
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateArtistBody,
  ) {
    const dto: UpdateArtistDTO = {
      name: body.name,
      photoURL: body.photoURL,
      genreIds: body.genreIds,
    }

    const updated = await this.updateArtistUseCase.execute(id, dto)

    return ArtistPresenter.toHTTP(updated)
  }
}
