export type ResponseUserProfileDTO = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  photoUrl: string | null
}
