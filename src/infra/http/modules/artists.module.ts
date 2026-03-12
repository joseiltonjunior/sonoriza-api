import { Module } from '@nestjs/common'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaArtistRepository } from '@/infra/database/prisma/prisma-artist.repository.service'
import { PrismaGenreRepository } from '@/infra/database/prisma/prisma-genre.repository.service'
import { RolesGuard } from '@/infra/auth/roles.guard'

import {
  ArtistsRepository,
  ArtistsRepositoryToken,
} from '@/domain/artists/repositories/artists-repository'
import { CreateArtistUseCase } from '@/domain/artists/use-cases/create-artist.use-case'
import { FetchArtistsUseCase } from '@/domain/artists/use-cases/fetch-artists.use-case'
import { GetArtistByIdUseCase } from '@/domain/artists/use-cases/get-artist-by-id.use-case'
import { UpdateArtistUseCase } from '@/domain/artists/use-cases/update-artist.use-case'
import { DeleteArtistUseCase } from '@/domain/artists/use-cases/delete-artist.use-case'
import {
  GenresRepository,
  GenresRepositoryToken,
} from '@/domain/genres/repositories/genres-repository'

import { CreateArtistController } from '../controllers/artists/create-artist.controller'
import { FetchArtistsController } from '../controllers/artists/fetch-artists.controller'
import { GetArtistByIdController } from '../controllers/artists/get-artist-by-id.controller'
import { UpdateArtistController } from '../controllers/artists/update-artist.controller'
import { DeleteArtistController } from '../controllers/artists/delete-artist.controller'

@Module({
  controllers: [
    CreateArtistController,
    FetchArtistsController,
    GetArtistByIdController,
    UpdateArtistController,
    DeleteArtistController,
  ],
  providers: [
    PrismaService,
    RolesGuard,
    {
      provide: ArtistsRepositoryToken,
      useClass: PrismaArtistRepository,
    },
    {
      provide: GenresRepositoryToken,
      useClass: PrismaGenreRepository,
    },
    {
      provide: CreateArtistUseCase,
      useFactory: (
        artistsRepo: ArtistsRepository,
        genresRepo: GenresRepository,
      ) => new CreateArtistUseCase(artistsRepo, genresRepo),
      inject: [ArtistsRepositoryToken, GenresRepositoryToken],
    },
    {
      provide: FetchArtistsUseCase,
      useFactory: (repo: ArtistsRepository) => new FetchArtistsUseCase(repo),
      inject: [ArtistsRepositoryToken],
    },
    {
      provide: GetArtistByIdUseCase,
      useFactory: (repo: ArtistsRepository) => new GetArtistByIdUseCase(repo),
      inject: [ArtistsRepositoryToken],
    },
    {
      provide: UpdateArtistUseCase,
      useFactory: (
        artistsRepo: ArtistsRepository,
        genresRepo: GenresRepository,
      ) => new UpdateArtistUseCase(artistsRepo, genresRepo),
      inject: [ArtistsRepositoryToken, GenresRepositoryToken],
    },
    {
      provide: DeleteArtistUseCase,
      useFactory: (repo: ArtistsRepository) => new DeleteArtistUseCase(repo),
      inject: [ArtistsRepositoryToken],
    },
  ],
  exports: [ArtistsRepositoryToken],
})
export class ArtistsModule {}
