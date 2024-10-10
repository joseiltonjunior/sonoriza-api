import { RouteShorthandOptions } from 'fastify'

interface schemasProps {
  registerMusic: RouteShorthandOptions
}

export const schemasMusics: schemasProps = {
  registerMusic: {
    schema: {
      tags: ['Musics'],
      summary: 'Register music',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          title: { type: 'string' },
          album: { type: 'string' },
          color: { type: 'string' },
          artwork: { type: 'string' },
          url: { type: 'string' },
        },
      },
      response: {
        201: {
          description: 'Successful response',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            title: { type: 'string' },
            album: { type: 'string' },
            color: { type: 'string' },
            artwork: { type: 'string' },
            url: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
}
