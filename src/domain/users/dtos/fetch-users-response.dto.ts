import { User } from '../entities/user'

export type FetchUsersResponseDTO = {
  data: User[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}
