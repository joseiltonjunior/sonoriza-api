import { Module } from '@nestjs/common'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaMusicRepository } from '@/infra/database/prisma/prisma-music.repository.service'

import { CreateMusicController } from '../controllers/musics/create-music.controller'

import { CreateMusicUseCase } from '@/domain/musics/use-cases/create-music.use-case'
import { FetchMusicsUseCase } from '@/domain/musics/use-cases/fetch-music.use-case'
import { UpdateMusicUseCase } from '@/domain/musics/use-cases/update-music.use-case'
import { DeleteMusicUseCase } from '@/domain/musics/use-cases/delete-music.use-case'
import {
  MusicRepository,
  MusicRepositoryToken,
} from '@/domain/musics/repositories/music-repository'
import { FetchMusicsController } from '../controllers/musics/fetch-musics.controller'
import { UpdateMusicController } from '../controllers/musics/update-music.controller'
import { DeleteMusicController } from '../controllers/musics/delete-music.controller'
import {
  ArtistRepository,
  ArtistRepositoryToken,
} from '@/domain/musics/repositories/artist-repository'
import {
  GenreRepository,
  GenreRepositoryToken,
} from '@/domain/musics/repositories/genre-repository'
import { PrismaArtistRepository } from '@/infra/database/prisma/prisma-artist.repository.service'
import { PrismaGenreRepository } from '@/infra/database/prisma/prisma-genre.repository.service'

@Module({
  controllers: [
    CreateMusicController,
    FetchMusicsController,
    UpdateMusicController,
    DeleteMusicController,
  ],
  providers: [
    PrismaService,
    {
      provide: MusicRepositoryToken,
      useClass: PrismaMusicRepository,
    },
    {
      provide: ArtistRepositoryToken,
      useClass: PrismaArtistRepository,
    },
    {
      provide: GenreRepositoryToken,
      useClass: PrismaGenreRepository,
    },
    {
      provide: CreateMusicUseCase,
      useFactory: (
        musicRepo: MusicRepository,
        artistRepo: ArtistRepository,
        genreRepo: GenreRepository,
      ) => new CreateMusicUseCase(musicRepo, artistRepo, genreRepo),
      inject: [MusicRepositoryToken, ArtistRepositoryToken, GenreRepositoryToken],
    },
    {
      provide: FetchMusicsUseCase,
      useFactory: (repo: MusicRepository) => new FetchMusicsUseCase(repo),
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
