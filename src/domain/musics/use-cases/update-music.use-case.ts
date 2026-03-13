import { UpdateMusicDTO } from '../dtos/update-music.dto'
import { MusicNotFoundError } from '../errors/music-not-found-error'
import { MusicRepository } from '../repositories/music-repository'

export class UpdateMusicUseCase {
  constructor(private musicRepository: MusicRepository) {}

  async execute(id: string, data: UpdateMusicDTO) {
    const music = await this.musicRepository.findById(id)

    if (!music) {
      throw new MusicNotFoundError()
    }

    music.update(data)

    await this.musicRepository.update(music)

    const persisted = await this.musicRepository.findById(id)
    return persisted ?? music
  }
}
