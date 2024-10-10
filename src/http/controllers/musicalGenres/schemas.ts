import { RouteShorthandOptions } from 'fastify'

interface schemasProps {
  registerMusicalGenre: RouteShorthandOptions
  editMusicalGenre: RouteShorthandOptions
  fetchMusicalGenre: RouteShorthandOptions
}

export const schemasMusicalGenres: schemasProps = {
  registerMusicalGenre: {
    schema: {
      tags: ['MusicalGenres'],
      summary: 'Register address',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      },
      response: {
        201: {
          description: 'Successful response',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  editMusicalGenre: {
    schema: {
      tags: ['MusicalGenres'],
      summary: 'Edit musical genre',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          id: { type: 'string' },
        },
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', format: 'uuid' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },

  fetchMusicalGenre: {
    schema: {
      tags: ['MusicalGenres'],
      summary: 'Fetch musical genre',
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
}
