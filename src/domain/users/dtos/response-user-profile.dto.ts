export type ResponseUserProfileDTO = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  accountStatus: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED'
  photoUrl: string | null
}
