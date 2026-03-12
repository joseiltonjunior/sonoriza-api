export class Session {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly refreshTokenJti: string,
    public refreshTokenHash: string,
    public expiresAt: Date,
    public revokedAt: Date | null = null,
    public lastUsedAt: Date | null = null,
    public replacedById: string | null = null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  revoke(replacedById?: string) {
    this.revokedAt = new Date()
    this.replacedById = replacedById ?? null
    this.updatedAt = new Date()
  }

  markUsed() {
    this.lastUsedAt = new Date()
    this.updatedAt = new Date()
  }

  isExpired(referenceDate = new Date()) {
    return this.expiresAt.getTime() <= referenceDate.getTime()
  }
}
