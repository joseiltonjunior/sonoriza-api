import { Module } from '@nestjs/common'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaMusicRepository } from '@/infra/database/prisma/prisma-music.repository.service'

import { CreateMusicController } from '../controllers/musics/create-music.controller'

import { CreateMusicUseCase } from '@/domain/musics/use-cases/create-music.use-case'
import { FetchMusicsUseCase } from '@/domain/musics/use-cases/fetch-music.use-case'
import { UpdateMusicUseCase } from '@/domain/musics/use-cases/update-music.use-case'
import { DeleteMusicUseCase } from '@/domain/musics/use-cases/delete-music.use-case'
import { GetMusicByIdUseCase } from '@/domain/musics/use-cases/get-music-by-id.use-case'
import {
  MusicRepository,
  MusicRepositoryToken,
} from '@/domain/musics/repositories/music-repository'
import { FetchMusicsController } from '../controllers/musics/fetch-musics.controller'
import { GetMusicByIdController } from '../controllers/musics/get-music-by-id.controller'
import { UpdateMusicController } from '../controllers/musics/update-music.controller'
import { DeleteMusicController } from '../controllers/musics/delete-music.controller'
import {
  ArtistsRepository,
  ArtistsRepositoryToken,
} from '@/domain/artists/repositories/artists-repository'
import {
  GenresRepository,
  GenresRepositoryToken,
} from '@/domain/genres/repositories/genres-repository'
import { PrismaArtistRepository } from '@/infra/database/prisma/prisma-artist.repository.service'
import { PrismaGenreRepository } from '@/infra/database/prisma/prisma-genre.repository.service'
import { RolesGuard } from '@/infra/auth/roles.guard'

@Module({
  controllers: [
    CreateMusicController,
    FetchMusicsController,
    GetMusicByIdController,
    UpdateMusicController,
    DeleteMusicController,
  ],
  providers: [
    PrismaService,
    RolesGuard,
    {
      provide: MusicRepositoryToken,
      useClass: PrismaMusicRepository,
    },
    {
      provide: ArtistsRepositoryToken,
      useClass: PrismaArtistRepository,
    },
    {
      provide: GenresRepositoryToken,
      useClass: PrismaGenreRepository,
    },
    {
      provide: CreateMusicUseCase,
      useFactory: (
        musicRepo: MusicRepository,
        artistsRepo: ArtistsRepository,
        genresRepo: GenresRepository,
      ) => new CreateMusicUseCase(musicRepo, artistsRepo, genresRepo),
      inject: [MusicRepositoryToken, ArtistsRepositoryToken, GenresRepositoryToken],
    },
    {
      provide: FetchMusicsUseCase,
      useFactory: (repo: MusicRepository) => new FetchMusicsUseCase(repo),
      inject: [MusicRepositoryToken],
    },
    {
      provide: GetMusicByIdUseCase,
      useFactory: (repo: MusicRepository) => new GetMusicByIdUseCase(repo),
      inject: [MusicRepositoryToken],
    },
    {
      provide: UpdateMusicUseCase,
      useFactory: (repo: MusicRepository) => new UpdateMusicUseCase(repo),
      inject: [MusicRepositoryToken],
    },
    {
      provide: DeleteMusicUseCase,
      useFactory: (repo: MusicRepository) => new DeleteMusicUseCase(repo),
      inject: [MusicRepositoryToken],
    },
  ],
  exports: [MusicRepositoryToken],
})
export class MusicsModule {}
