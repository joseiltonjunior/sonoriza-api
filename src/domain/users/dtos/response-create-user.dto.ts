import { Role, AccountStatus } from '../entities/user'

export type ResponseCreateUserDTO = {
  id: string
  name: string
  email: string
  role: Role
  accountStatus: AccountStatus
  photoUrl: string | null
  createdAt: Date
}
