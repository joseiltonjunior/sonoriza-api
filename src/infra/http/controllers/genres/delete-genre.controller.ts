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

import { DeleteGenreUseCase } from '@/domain/genres/use-cases/delete-genre.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'

@ApiTags('Genres')
@Controller('/genres')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DeleteGenreController {
  constructor(private deleteGenreUseCase: DeleteGenreUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a genre' })
  @ApiParam({
    name: 'id',
    example: 'genre-id-uuid',
  })
  @ApiNoContentResponse({
    description: 'Genre deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiNotFoundResponse({
    description: 'Genre not found',
  })
  async handle(@Param('id') id: string): Promise<void> {
    await this.deleteGenreUseCase.execute(id)
  }
}
