import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { GetArtistByIdUseCase } from '@/domain/artists/use-cases/get-artist-by-id.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ArtistPresenter } from '../../presenters/artist.presenter'
import { ArtistResponseSwaggerDTO } from '../../swagger/artists/artist-response.swagger.dto'

@ApiTags('Artists')
@Controller('/artists')
@UseGuards(JwtAuthGuard)
export class GetArtistByIdController {
  constructor(private readonly getArtistByIdUseCase: GetArtistByIdUseCase) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an artist by id' })
  @ApiParam({
    name: 'id',
    example: 'artist-id-uuid',
  })
  @ApiOkResponse({
    description: 'Artist fetched successfully',
    type: ArtistResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  async handle(@Param('id') id: string) {
    const artist = await this.getArtistByIdUseCase.execute(id)

    return ArtistPresenter.toHTTP(artist)
  }
}
