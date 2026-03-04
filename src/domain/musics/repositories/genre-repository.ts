export interface GenreRepository {
  findById(id: string): Promise<{ id: string } | null>
}

export const GenreRepositoryToken = Symbol('GenreRepository')
