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

import { DeleteMusicUseCase } from '@/domain/musics/use-cases/delete-music.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'

@ApiTags('Musics')
@Controller('/musics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DeleteMusicController {
  constructor(private deleteMusicUseCase: DeleteMusicUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a music' })
  @ApiParam({
    name: 'id',
    example: 'uuid-da-musica',
  })
  @ApiNoContentResponse({
    description: 'Music deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiNotFoundResponse({
    description: 'Music not found',
  })
  async handle(@Param('id') id: string): Promise<void> {
    await this.deleteMusicUseCase.execute(id)
  }
}
