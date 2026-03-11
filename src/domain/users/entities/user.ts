export type Role = 'ADMIN' | 'USER'

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: Role = 'USER',
    public isActive: boolean = true,
    public photoUrl: string | null = null,
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

  setActiveStatus(isActive: boolean) {
    this.isActive = isActive
    this.updatedAt = new Date()
  }

  softDelete() {
    this.isActive = false
    this.deletedAt = new Date()
    this.updatedAt = new Date()
  }
}
