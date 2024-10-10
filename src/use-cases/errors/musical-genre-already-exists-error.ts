export class MusicalGenreAlreadyExistError extends Error {
  constructor() {
    super('Musical Genre already exist.')
    this.name = 'MusicalGenreAlreadyExistError' // Optional but good for clarity
  }
}
