export type ResponseUpdateUserStatusDTO = {
  id: string
  accountStatus: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED'
  updatedAt: Date
}
