import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Fetch musical genre (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('slould be able to get a musical genre', async () => {
    const musicalGenreCreated = await request(app.server)
      .post('/musicalGenre')
      .send({
        name: 'Deep House',
      })

    const musicalGenre = JSON.parse(musicalGenreCreated.text)

    const responseGet = await request(app.server)
      .get(`/musicalGenre/${musicalGenre.id}`)
      .send()

    const responseParse = JSON.parse(responseGet.text)

    expect(responseGet.statusCode).toEqual(200)
    expect(responseParse).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Deep House',
      }),
    )
  })
})
