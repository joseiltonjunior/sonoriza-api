import fastify from 'fastify'

import { musicalGenresRoutes } from './http/controllers/musicalGenres/routes'
import { musicsRoutes } from './http/controllers/musics/routes'
import { artistsRoutes } from './http/controllers/artists/routes'
import { ZodError } from 'zod'
import { env } from './env'

import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'

import { swaggerOptions } from './swagger'

export const app = fastify()

app.register(fastifySwagger, swaggerOptions)
app.register(fastifySwaggerUi, {
  routePrefix: '/swagger',
})

app.register(musicalGenresRoutes)
app.register(musicsRoutes)
app.register(artistsRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
