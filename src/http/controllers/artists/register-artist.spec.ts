import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Register artist (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('slould be able to register a artist', async () => {
    const response = await request(app.server).post('/artist').send({
      name: 'Ritmo',
      photoURL: 'ritmo.jpeg',
    })

    const artist = JSON.parse(response.text)

    expect(response.statusCode).toEqual(201)
    expect(artist).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        created_at: expect.any(String),
        name: 'Ritmo',
      }),
    )
  })
})
