import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'

import { makeRegisterMusicalGenreUseCase } from '@/use-cases/factories/make-register-musical-genre-use-case'
import { MusicalGenreAlreadyExistError } from '@/use-cases/errors/musical-genre-already-exists-error'

export async function registerMusicalGenre(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
  })

  const { name } = registerBodySchema.parse(request.body)

  try {
    const registerMusicalGenreUseCase = makeRegisterMusicalGenreUseCase()

    const { musicalGenre } = await registerMusicalGenreUseCase.execute({
      name,
    })

    return reply.status(201).send(musicalGenre)
  } catch (err) {
    if (err instanceof MusicalGenreAlreadyExistError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }
}
