import { Role } from '../entities/user'

export type ResponseUpdateUserDTO = {
  id: string
  name: string
  email: string
  role: Role
  photoUrl: string | null
  updatedAt: Date
}
