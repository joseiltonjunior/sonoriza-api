import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'

import { makeEditMusicalGenresUseCase } from '@/use-cases/factories/make-edit-musical-genre-use-case'
import { makeFetchMusicalGenreUseCase } from '@/use-cases/factories/make-fetch-musical-genre-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UserNotExistsError } from '@/use-cases/errors/user-not-exists'

export async function editMusicalGenre(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editBodySchema = z.object({
    name: z.string(),
    id: z.string(),
  })

  const { name, id } = editBodySchema.parse(request.body)

  try {
    const editMusicalGenreUseCase = makeEditMusicalGenresUseCase()
    const fetchEditMusialGenreUseCase = makeFetchMusicalGenreUseCase()

    await fetchEditMusialGenreUseCase.execute({
      id,
    })

    const { musicalGenre } = await editMusicalGenreUseCase.execute({
      name,
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
