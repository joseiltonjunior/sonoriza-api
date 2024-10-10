import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Register musical genre (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('slould be able to register a musical genre', async () => {
    const response = await request(app.server).post('/musicalGenre').send({
      name: 'Psytrance',
    })

    const musicalGenre = JSON.parse(response.text)

    expect(response.statusCode).toEqual(201)
    expect(musicalGenre).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        created_at: expect.any(String),
      }),
    )
  })
})
