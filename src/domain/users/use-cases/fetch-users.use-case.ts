import { FetchUsersDTO } from '../dtos/fetch-users.dto'
import { FetchUsersResponseDTO } from '../dtos/fetch-users-response.dto'
import { UserRepository } from '../repositories/user-repository'

export class FetchUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ page }: FetchUsersDTO): Promise<FetchUsersResponseDTO> {
    const limit = 20

    const { data, total } = await this.userRepository.findMany({
      page,
      limit,
    })

    const lastPage = Math.ceil(total / limit)

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
      },
    }
  }
}
