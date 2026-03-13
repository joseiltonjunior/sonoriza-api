import { AccountVerification } from '../entities/account-verification'

export interface AccountVerificationRepository {
  create(accountVerification: AccountVerification): Promise<void>
  findLatestPendingByUserId(userId: string): Promise<AccountVerification | null>
  update(accountVerification: AccountVerification): Promise<void>
}

export const AccountVerificationRepositoryToken = Symbol(
  'AccountVerificationRepository',
)
