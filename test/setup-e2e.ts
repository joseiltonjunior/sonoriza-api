import { createTestDatabase, deleteTestDatabase } from '@/utils/test-db'

let schemaId: string

beforeAll(async () => {
  const { schemaId: id } = await createTestDatabase()
  schemaId = id
})

afterAll(async () => {
  await deleteTestDatabase(schemaId)
})
