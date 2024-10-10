import { FastifyRequest, FastifyReply } from 'fastify'

import { makeFetchMusicalGenreUseCase } from '@/use-cases/factories/make-fetch-musical-genre-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UserNotExistsError } from '@/use-cases/errors/user-not-exists'

export async function fetchMusicalGenre(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchMusicalGenreUseCase = makeFetchMusicalGenreUseCase()

    const { id } = request.params as { id: string }

    const { musicalGenre } = await fetchMusicalGenreUseCase.execute({
      id,
    })

    return reply.status(200).send(musicalGenre)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof UserNotExistsError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
