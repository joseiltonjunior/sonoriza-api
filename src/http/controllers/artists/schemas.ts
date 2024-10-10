import { RouteShorthandOptions } from 'fastify'

interface schemasProps {
  registerArtist: RouteShorthandOptions
}

export const schemasArtists: schemasProps = {
  registerArtist: {
    schema: {
      tags: ['Artists'],
      summary: 'Register artist',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          photoURL: { type: 'string' },
        },
      },
      response: {
        201: {
          description: 'Successful response',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            photoURL: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
}
