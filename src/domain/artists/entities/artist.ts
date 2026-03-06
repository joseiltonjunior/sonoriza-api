import { UpdateArtistDTO } from '../dtos/update-artist.dto'

export class Artist {
  constructor(
    public readonly id: string,
    public name: string,
    public photoURL: string,
    public like: number,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt: Date | null = null,
  ) {}

  update(data: UpdateArtistDTO) {
    if (data.name !== undefined) this.name = data.name
    if (data.photoURL !== undefined) this.photoURL = data.photoURL
    if (data.like !== undefined) this.like = data.like

    this.updatedAt = new Date()
  }

  softDelete() {
    this.deletedAt = new Date()
    this.updatedAt = new Date()
  }
}
