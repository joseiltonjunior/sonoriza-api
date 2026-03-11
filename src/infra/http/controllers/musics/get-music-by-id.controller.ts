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

import { GetMusicByIdUseCase } from '@/domain/musics/use-cases/get-music-by-id.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { MusicPresenter } from '../../presenters/music.presenter'
import { MusicResponseSwaggerDTO } from '../../swagger/musics/music-response.swagger.dto'

@ApiTags('Musics')
@Controller('/musics')
@UseGuards(JwtAuthGuard)
export class GetMusicByIdController {
  constructor(private readonly getMusicByIdUseCase: GetMusicByIdUseCase) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a music by id' })
  @ApiParam({
    name: 'id',
    example: 'music-id-uuid',
  })
  @ApiOkResponse({
    description: 'Music fetched successfully',
    type: MusicResponseSwaggerDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Insufficient role permissions' })
  @ApiNotFoundResponse({ description: 'Music not found' })
  async handle(@Param('id') id: string) {
    const music = await this.getMusicByIdUseCase.execute(id)

    return MusicPresenter.toHTTP(music)
  }
}
