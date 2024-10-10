import { FastifyInstance } from 'fastify'

import { registerArtist } from './register-artist'

import { schemasArtists } from './schemas'

export async function artistsRoutes(app: FastifyInstance) {
  app.post('/artist', schemasArtists.registerArtist, registerArtist)
}
