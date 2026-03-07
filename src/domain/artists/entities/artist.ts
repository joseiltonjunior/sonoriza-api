import { UpdateArtistDTO } from '../dtos/update-artist.dto'

export interface ArtistMusicalGenre {
  id: string
  name: string
}

export class Artist {
  constructor(
    public readonly id: string,
    public name: string,
    public photoURL: string,
    public like: number,
    public genreIds: string[] = [],
    public musicalGenres: ArtistMusicalGenre[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt: Date | null = null,
  ) {}

  update(data: UpdateArtistDTO) {
    if (data.name !== undefined) this.name = data.name
    if (data.photoURL !== undefined) this.photoURL = data.photoURL
    if (data.genreIds !== undefined) this.genreIds = [...new Set(data.genreIds)]

    this.updatedAt = new Date()
  }

  softDelete() {
    this.deletedAt = new Date()
    this.updatedAt = new Date()
  }
}
