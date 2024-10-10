import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Register music (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('slould be able to register a music', async () => {
    const musicalGenre = await request(app.server).post('/musicalGenre').send({
      name: 'Psytrance',
    })

    const artist = await request(app.server).post('/artist').send({
      name: 'Ritmo',
      photoURL: 'ritmo.jpeg',
    })

    const { id: artistId } = JSON.parse(artist.text)
    const { id: musicalGenreId } = JSON.parse(musicalGenre.text)

    const response = await request(app.server)
      .post('/music')
      .send({
        title: 'Masada',
        album: 'Best Of',
        color: '#c53a27',
        musicalGenreId,
        artwork: '',
        url: '',
        artistsId: [artistId],
      })

    const music = JSON.parse(response.text)

    console.log(music)

    expect(response.statusCode).toEqual(201)
    expect(music).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        created_at: expect.any(String),
        title: 'Masada',
      }),
    )
  })
})
