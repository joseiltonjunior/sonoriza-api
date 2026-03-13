export class AccountVerification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public codeHash: string,
    public expiresAt: Date,
    public resendAvailableAt: Date,
    public attempts: number = 0,
    public maxAttempts: number = 5,
    public verifiedAt: Date | null = null,
    public revokedAt: Date | null = null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  isExpired(referenceDate = new Date()) {
    return this.expiresAt.getTime() <= referenceDate.getTime()
  }

  canResend(referenceDate = new Date()) {
    return this.resendAvailableAt.getTime() <= referenceDate.getTime()
  }

  incrementAttempts() {
    this.attempts += 1
    this.updatedAt = new Date()
  }

  hasReachedMaxAttempts() {
    return this.attempts >= this.maxAttempts
  }

  verify() {
    this.verifiedAt = new Date()
    this.updatedAt = new Date()
  }

  revoke() {
    this.revokedAt = new Date()
    this.updatedAt = new Date()
  }
}
