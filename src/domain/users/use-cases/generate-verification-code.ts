import { randomInt } from 'node:crypto'

export function generateVerificationCode() {
  return randomInt(100000, 1000000).toString()
}
