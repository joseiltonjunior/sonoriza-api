import { Module } from '@nestjs/common'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaGenreRepository } from '@/infra/database/prisma/prisma-genre.repository.service'
import { RolesGuard } from '@/infra/auth/roles.guard'

import {
  GenresRepository,
  GenresRepositoryToken,
} from '@/domain/genres/repositories/genres-repository'
import { CreateGenreUseCase } from '@/domain/genres/use-cases/create-genre.use-case'
import { FetchGenresUseCase } from '@/domain/genres/use-cases/fetch-genres.use-case'
import { UpdateGenreUseCase } from '@/domain/genres/use-cases/update-genre.use-case'
import { DeleteGenreUseCase } from '@/domain/genres/use-cases/delete-genre.use-case'

import { CreateGenreController } from '../controllers/genres/create-genre.controller'
import { FetchGenresController } from '../controllers/genres/fetch-genres.controller'
import { UpdateGenreController } from '../controllers/genres/update-genre.controller'
import { DeleteGenreController } from '../controllers/genres/delete-genre.controller'

@Module({
  controllers: [
    CreateGenreController,
    FetchGenresController,
    UpdateGenreController,
    DeleteGenreController,
  ],
  providers: [
    PrismaService,
    RolesGuard,
    {
      provide: GenresRepositoryToken,
      useClass: PrismaGenreRepository,
    },
    {
      provide: CreateGenreUseCase,
      useFactory: (repo: GenresRepository) => new CreateGenreUseCase(repo),
      inject: [GenresRepositoryToken],
    },
    {
      provide: FetchGenresUseCase,
      useFactory: (repo: GenresRepository) => new FetchGenresUseCase(repo),
      inject: [GenresRepositoryToken],
    },
    {
      provide: UpdateGenreUseCase,
      useFactory: (repo: GenresRepository) => new UpdateGenreUseCase(repo),
      inject: [GenresRepositoryToken],
    },
    {
      provide: DeleteGenreUseCase,
      useFactory: (repo: GenresRepository) => new DeleteGenreUseCase(repo),
      inject: [GenresRepositoryToken],
    },
  ],
  exports: [GenresRepositoryToken],
})
export class GenresModule {}
