import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'

import { makeRegisterMusicUseCase } from '@/use-cases/factories/make-register-music-use-case'
import { InternalServerError } from '@/use-cases/errors/internal-error'

export async function registerMusic(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    album: z.string(),
    title: z.string(),
    artwork: z.string(),
    color: z.string(),
    url: z.string(),
    musicalGenreId: z.string(),
    artistsId: z.array(z.string()),
  })

  const { album, artwork, color, title, url, musicalGenreId, artistsId } =
    registerBodySchema.parse(request.body)

  try {
    const registerMusicUseCase = makeRegisterMusicUseCase()

    const { music } = await registerMusicUseCase.execute({
      album,
      artwork,
      color,
      title,
      url,
      musicalGenreId,
      artistsId,
    })

    return reply.status(201).send(music)
  } catch (err) {
    if (err instanceof InternalServerError) {
      return reply.send({ message: err.message })
    }

    throw err
  }
}
