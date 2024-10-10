import { FastifyInstance } from 'fastify'

import { registerMusic } from './register-music'

import { schemasMusics } from './schemas'

export async function musicsRoutes(app: FastifyInstance) {
  app.post('/music', schemasMusics.registerMusic, registerMusic)
}
