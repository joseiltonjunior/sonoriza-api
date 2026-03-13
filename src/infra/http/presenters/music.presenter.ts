import { Music } from '@/domain/musics/entities/music'

export class MusicPresenter {
  static toHTTP(music: Music) {
    return {
      id: music.id,
      title: music.title,
      url: music.audioPath,
      genreId: music.genreId,
      genre: music.genre,
      album: music.album,
      artwork: music.coverPath,
      color: music.color,
      like: music.like,
      view: music.view,
      artists: music.artists,
    }
  }
}
