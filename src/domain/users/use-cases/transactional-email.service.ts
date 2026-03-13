export interface TransactionalEmailService {
  sendAccountVerification(input: {
    to: string
    name: string
    code: string
    expiresInMinutes: number
  }): Promise<void>
}

export const TransactionalEmailServiceToken = Symbol(
  'TransactionalEmailService',
)
