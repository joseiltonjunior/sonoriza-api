import { Module } from '@nestjs/common'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaArtistRepository } from '@/infra/database/prisma/prisma-artist.repository.service'
import { RolesGuard } from '@/infra/auth/roles.guard'

import {
  ArtistsRepository,
  ArtistsRepositoryToken,
} from '@/domain/artists/repositories/artists-repository'
import { CreateArtistUseCase } from '@/domain/artists/use-cases/create-artist.use-case'
import { FetchArtistsUseCase } from '@/domain/artists/use-cases/fetch-artists.use-case'
import { UpdateArtistUseCase } from '@/domain/artists/use-cases/update-artist.use-case'
import { DeleteArtistUseCase } from '@/domain/artists/use-cases/delete-artist.use-case'

import { CreateArtistController } from '../controllers/artists/create-artist.controller'
import { FetchArtistsController } from '../controllers/artists/fetch-artists.controller'
import { UpdateArtistController } from '../controllers/artists/update-artist.controller'
import { DeleteArtistController } from '../controllers/artists/delete-artist.controller'

@Module({
  controllers: [
    CreateArtistController,
    FetchArtistsController,
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
      provide: CreateArtistUseCase,
      useFactory: (repo: ArtistsRepository) => new CreateArtistUseCase(repo),
      inject: [ArtistsRepositoryToken],
    },
    {
      provide: FetchArtistsUseCase,
      useFactory: (repo: ArtistsRepository) => new FetchArtistsUseCase(repo),
      inject: [ArtistsRepositoryToken],
    },
    {
      provide: UpdateArtistUseCase,
      useFactory: (repo: ArtistsRepository) => new UpdateArtistUseCase(repo),
      inject: [ArtistsRepositoryToken],
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
