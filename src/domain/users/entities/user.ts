export type Role = 'ADMIN' | 'USER'
export type AccountStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED'

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: Role = 'USER',
    public accountStatus: AccountStatus = 'PENDING_VERIFICATION',
    public photoUrl: string | null = null,
    public emailVerifiedAt: Date | null = null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt: Date | null = null,
  ) {}

  updateProfile(data: {
    name?: string
    email?: string
    photoUrl?: string | null
  }) {
    if (data.name !== undefined) this.name = data.name
    if (data.email !== undefined) this.email = data.email
    if (data.photoUrl !== undefined) this.photoUrl = data.photoUrl

    this.updatedAt = new Date()
  }

  markEmailVerified() {
    this.accountStatus = 'ACTIVE'
    this.emailVerifiedAt = new Date()
    this.updatedAt = new Date()
  }

  setAccountStatus(accountStatus: AccountStatus) {
    this.accountStatus = accountStatus

    if (accountStatus === 'ACTIVE' && !this.emailVerifiedAt) {
      this.emailVerifiedAt = new Date()
    }

    this.updatedAt = new Date()
  }

  softDelete() {
    this.accountStatus = 'SUSPENDED'
    this.deletedAt = new Date()
    this.updatedAt = new Date()
  }
}
