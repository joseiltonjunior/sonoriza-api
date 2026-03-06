import { Controller, Delete, Param, HttpCode, UseGuards } from '@nestjs/common'

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { DeleteArtistUseCase } from '@/domain/artists/use-cases/delete-artist.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'

@ApiTags('Artists')
@Controller('/artists')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DeleteArtistController {
  constructor(private deleteArtistUseCase: DeleteArtistUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete an artist' })
  @ApiParam({
    name: 'id',
    example: 'artist-id-uuid',
  })
  @ApiNoContentResponse({
    description: 'Artist deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiNotFoundResponse({
    description: 'Artist not found',
  })
  async handle(@Param('id') id: string): Promise<void> {
    await this.deleteArtistUseCase.execute(id)
  }
}
