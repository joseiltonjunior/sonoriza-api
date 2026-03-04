import { Module } from '@nestjs/common'
import { MusicsModule } from './modules/musics.module'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule, MusicsModule],
})
export class HttpModule {}
