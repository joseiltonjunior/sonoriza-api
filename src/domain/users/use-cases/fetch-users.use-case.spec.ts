import { User } from '../entities/user'
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository'
import { FetchUsersUseCase } from './fetch-users.use-case'

function makeUser(index: number) {
  return new User(
    `user-${index}`,
    `User ${index}`,
    `user-${index}@example.com`,
    '123456',
  )
}

describe('FetchUsersUseCase', () => {
  it('should fetch paginated users', async () => {
    const repo = new InMemoryUserRepository()
    const useCase = new FetchUsersUseCase(repo)

    for (let i = 1; i <= 25; i++) {
      repo.items.push(makeUser(i))
    }

    const toDelete = await repo.findById('user-25')
    if (toDelete) {
      toDelete.softDelete()
      await repo.update(toDelete)
    }

    const result = await useCase.execute({ page: 1 })

    expect(result.data).toHaveLength(20)
    expect(result.meta).toEqual({
      total: 24,
      page: 1,
      lastPage: 2,
    })
  })

  it('should fetch second page with remaining items', async () => {
    const repo = new InMemoryUserRepository()
    const useCase = new FetchUsersUseCase(repo)

    for (let i = 1; i <= 25; i++) {
      repo.items.push(makeUser(i))
    }

    const toDelete = await repo.findById('user-25')
    if (toDelete) {
      toDelete.softDelete()
      await repo.update(toDelete)
    }

    const result = await useCase.execute({ page: 2 })

    expect(result.data).toHaveLength(4)
    expect(result.meta).toEqual({
      total: 24,
      page: 2,
      lastPage: 2,
    })
  })
})
