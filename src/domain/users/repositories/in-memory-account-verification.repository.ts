import { AccountVerification } from '../entities/account-verification'
import { AccountVerificationRepository } from './account-verification-repository'

export class InMemoryAccountVerificationRepository implements AccountVerificationRepository {
  public items: AccountVerification[] = []

  async create(accountVerification: AccountVerification): Promise<void> {
    this.items.push(accountVerification)
  }

  async findLatestPendingByUserId(
    userId: string,
  ): Promise<AccountVerification | null> {
    const verification = this.items
      .filter(
        (item) =>
          item.userId === userId &&
          item.verifiedAt === null &&
          item.revokedAt === null,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]

    return verification ?? null
  }

  async update(accountVerification: AccountVerification): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id === accountVerification.id,
    )

    if (index >= 0) {
      this.items[index] = accountVerification
    }
  }
}
