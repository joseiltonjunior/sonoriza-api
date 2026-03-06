import { Module } from '@nestjs/common'
import { MusicsModule } from './modules/musics.module'
import { DatabaseModule } from '../database/database.module'
import { UsersModule } from './modules/users.module'

@Module({
  imports: [DatabaseModule, MusicsModule, UsersModule],
})
export class HttpModule {}
