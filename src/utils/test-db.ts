import { randomUUID } from 'node:crypto'
import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

export async function createTestDatabase() {
  const schemaId = `test_${randomUUID().replace(/-/g, '')}`

  const originalUrl = process.env.DATABASE_URL
  if (!originalUrl) throw new Error('DATABASE_URL not provided.')

  const url = new URL(originalUrl)
  url.searchParams.set('schema', schemaId)

  process.env.DATABASE_URL = url.toString()

  execSync('pnpm prisma migrate deploy')

  const prisma = new PrismaClient()

  return { prisma, schemaId }
}

export async function deleteTestDatabase(schemaId: string) {
  const prisma = new PrismaClient()

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`)
  await prisma.$disconnect()
}
