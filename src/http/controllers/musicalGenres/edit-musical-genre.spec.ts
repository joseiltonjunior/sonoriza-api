import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Edit musical genre (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('slould be able to edit a musical genre', async () => {
    const newMusicalGenre = await request(app.server)
      .post('/musicalGenre')
      .send({
        name: 'Deep House',
      })

    const newMusicalGenreParse = JSON.parse(newMusicalGenre.text)
    const response = await request(app.server).put('/musicalGenre').send({
      name: 'Psytrance',
      id: newMusicalGenreParse.id,
    })

    const editMusicalGenre = JSON.parse(response.text)

    expect(response.statusCode).toEqual(200)
    expect(editMusicalGenre).toEqual(
      expect.objectContaining({
        name: 'Psytrance',
      }),
    )
  })
})
