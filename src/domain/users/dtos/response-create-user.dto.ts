import { Role } from '../entities/user'

export type ResponseCreateUserDTO = {
  id: string
  name: string
  email: string
  role: Role
  photoUrl: string | null
  createdAt: Date
}
