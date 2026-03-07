export interface CreateMusicDTO {
  title: string
  slug: string
  audioPath: string
  album: string | null
  coverPath: string | null
  color: string | null
  durationSec: number | null
  releaseDate: Date | null
  genreId: string | null
  artistIds: string[]
}
