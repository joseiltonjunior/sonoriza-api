import { Genre } from '@/domain/genres/entities/genre'

export class GenrePresenter {
  static toHTTP(genre: Genre) {
    return {
      id: genre.id,
      name: genre.name,
    }
  }
}
