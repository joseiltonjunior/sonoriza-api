import { createHash } from 'node:crypto'

export function hashVerificationCode(code: string) {
  return createHash('sha256').update(code).digest('hex')
}
