import { FastifyDynamicSwaggerOptions } from '@fastify/swagger'

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  swagger: {
    info: {
      title: 'API Sonoriza',
      description: 'API Solid PostgreSQL',
      version: '1.0.0',
    },

    tags: [
      { name: 'Musics', description: 'Musics routes' },
      { name: 'Artists', description: 'Artists routes' },
      { name: 'Musical Genres', description: 'Musical Genres routes' },
    ],
    consumes: ['application/json'],
    produces: ['application/json'],
    // securityDefinitions: {
    //   bearerAuth: {
    //     type: 'apiKey',
    //     name: 'Authorization',
    //     in: 'header',
    //     description: 'Bearer token authentication',
    //   },
    // },
    definitions: {
      Music: {
        type: 'object',
        required: [
          'album',
          'title',
          'artwork',
          'color',
          'genre',
          'url',
          'artists',
        ],
        properties: {
          id: { type: 'string', format: 'uuid' },
          album: { type: 'string' },
          title: { type: 'string' },
          artwork: { type: 'string' },
          color: { type: 'string' },
          genre: { type: 'string' },
          url: { type: 'string' },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
          artists: {
            $ref: '#/definitions/Artist',
          },
        },
      },
      Artist: {
        type: 'object',
        required: ['musicalGenres', 'musics', 'name', 'photoURL', 'likes'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          musicalGenres: {
            $ref: '#/definitions/MusicalGenre',
          },
          musics: {
            $ref: '#/definitions/Music',
          },
          name: { type: 'string' },
          photoURL: { type: 'string' },
          likes: { type: 'number' },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      MusicalGenre: {
        type: 'object',
        required: ['name'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
}
