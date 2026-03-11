import { MusicNotFoundError } from '../errors/music-not-found-error'
import { MusicRepository } from '../repositories/music-repository'

export class GetMusicByIdUseCase {
  constructor(private readonly musicRepository: MusicRepository) {}

  async execute(id: string) {
    const music = await this.musicRepository.findById(id)

    if (!music) {
      throw new MusicNotFoundError()
    }

    return music
  }
}
