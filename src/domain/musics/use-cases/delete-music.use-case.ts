import { MusicNotFoundError } from '../errors/music-not-found-error'
import { MusicRepository } from '../repositories/music-repository'

export class DeleteMusicUseCase {
  constructor(private musicRepository: MusicRepository) {}

  async execute(id: string) {
    const music = await this.musicRepository.findById(id)

    if (!music) {
      throw new MusicNotFoundError()
    }

    music.softDelete()

    await this.musicRepository.update(music)
  }
}
