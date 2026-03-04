export interface ArtistRepository {
  findById(id: string): Promise<{ id: string } | null>
}

export const ArtistRepositoryToken = Symbol('ArtistRepository')
