import { Module } from '@nestjs/common'
import { MusicsModule } from './modules/musics.module'
import { DatabaseModule } from '../database/database.module'
import { UsersModule } from './modules/users.module'
import { GenresModule } from './modules/genres.module'

@Module({
  imports: [DatabaseModule, MusicsModule, UsersModule, GenresModule],
})
export class HttpModule {}
