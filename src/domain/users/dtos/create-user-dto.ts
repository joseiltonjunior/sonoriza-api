import { Role } from '../entities/user'

export type CreateUserDTO = {
  name: string
  email: string
  password: string
  role?: Role
}
