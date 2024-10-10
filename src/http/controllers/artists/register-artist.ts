import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'

import { makeRegisterArtistUseCase } from '@/use-cases/factories/make-register-artist-use-case'
import { InternalServerError } from '@/use-cases/errors/internal-error'

export async function registerArtist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    photoURL: z.string(),
  })

  const { name, photoURL } = registerBodySchema.parse(request.body)

  try {
    const registerArtistUseCase = makeRegisterArtistUseCase()

    const { artist } = await registerArtistUseCase.execute({
      name,
      photoURL,
    })

    return reply.status(201).send(artist)
  } catch (err) {
    if (err instanceof InternalServerError) {
      return reply.send({ message: err.message })
    }

    throw err
  }
}
