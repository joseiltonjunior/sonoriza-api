import { Controller, Delete, Param, HttpCode } from '@nestjs/common'

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger'

import { DeleteMusicUseCase } from '@/domain/musics/use-cases/delete-music.use-case'

@ApiTags('Musics')
@Controller('/musics')
export class DeleteMusicController {
  constructor(private deleteMusicUseCase: DeleteMusicUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft delete a music' })
  @ApiParam({
    name: 'id',
    example: 'uuid-da-musica',
  })
  @ApiNoContentResponse({
    description: 'Music deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Music not found',
  })
  async handle(@Param('id') id: string): Promise<void> {
    await this.deleteMusicUseCase.execute(id)
  }
}
