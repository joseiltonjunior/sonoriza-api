import { UpdateGenreDTO } from '../dtos/update-genre.dto'

export class Genre {
  constructor(
    public readonly id: string,
    public name: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt: Date | null = null,
  ) {}

  update(data: UpdateGenreDTO) {
    if (data.name !== undefined) this.name = data.name

    this.updatedAt = new Date()
  }

  softDelete() {
    this.deletedAt = new Date()
    this.updatedAt = new Date()
  }
}
