import { FastifyInstance } from 'fastify'

import { registerMusicalGenre } from './register-musical-genre'
import { fetchMusicalGenre } from './fetch-musical-genre'
import { editMusicalGenre } from './edit-musical-genre'

import { schemasMusicalGenres } from './schemas'

export async function musicalGenresRoutes(app: FastifyInstance) {
  app.post(
    '/musicalGenre',
    schemasMusicalGenres.registerMusicalGenre,
    registerMusicalGenre,
  )
  app.get(
    '/musicalGenre/:id',
    schemasMusicalGenres.fetchMusicalGenre,
    fetchMusicalGenre,
  )
  app.put(
    '/musicalGenre',
    schemasMusicalGenres.editMusicalGenre,
    editMusicalGenre,
  )
}
