import { Module } from '@nestjs/common'
import { MusicsModule } from './modules/musics.module'
import { DatabaseModule } from '../database/database.module'
import { UsersModule } from './modules/users.module'
import { GenresModule } from './modules/genres.module'
import { ArtistsModule } from './modules/artists.module'
import { UploadsModule } from './modules/uploads.module'
import { MetricsModule } from './modules/metrics.module'

@Module({
  imports: [
    DatabaseModule,
    MusicsModule,
    UsersModule,
    GenresModule,
    ArtistsModule,
    UploadsModule,
    MetricsModule,
  ],
})
export class HttpModule {}
