import { UpdateMusicDTO } from '../dtos/update-music.dto'

export interface MusicArtistGenre {
  id: string
  name: string
}

export interface MusicArtist {
  id: string
  name: string
  photoURL: string
  like: number
  musics: string[]
  musicalGenres: MusicArtistGenre[]
}

export class Music {
  constructor(
    public readonly id: string,
    public title: string,
    public slug: string,
    public audioPath: string,
    public album: string | null,
    public coverPath: string | null,
    public color: string | null,
    public like: number,
    public view: number,
    public durationSec: number | null,
    public releaseDate: Date | null,
    public genreId: string | null,
    public genre: string | null,
    public artistIds: string[] = [],
    public artists: MusicArtist[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt: Date | null = null,
  ) {}

  update(data: UpdateMusicDTO) {
    if (data.title !== undefined) this.title = data.title
    if (data.slug !== undefined) this.slug = data.slug
    if (data.audioPath !== undefined) this.audioPath = data.audioPath
    if (data.album !== undefined) this.album = data.album
    if (data.coverPath !== undefined) this.coverPath = data.coverPath
    if (data.color !== undefined) this.color = data.color
    if (data.durationSec !== undefined) this.durationSec = data.durationSec
    if (data.releaseDate !== undefined) this.releaseDate = data.releaseDate
    if (data.genreId !== undefined) this.genreId = data.genreId
    if (data.artistIds !== undefined) this.artistIds = data.artistIds

    this.updatedAt = new Date()
  }

  softDelete() {
    this.deletedAt = new Date()
    this.updatedAt = new Date()
  }
}
