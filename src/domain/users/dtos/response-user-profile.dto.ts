export type ResponseUserProfileDTO = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  isActive: boolean
  photoUrl: string | null
}
