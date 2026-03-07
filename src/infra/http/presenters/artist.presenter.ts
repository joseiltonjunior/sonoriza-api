import { Artist } from '@/domain/artists/entities/artist'

export class ArtistPresenter {
  static toHTTP(artist: Artist) {
    return {
      id: artist.id,
      name: artist.name,
      photoURL: artist.photoURL,
      like: artist.like,
      genreIds: artist.genreIds,
      musicalGenres: artist.musicalGenres,
    }
  }
}
