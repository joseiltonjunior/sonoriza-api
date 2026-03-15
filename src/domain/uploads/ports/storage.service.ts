export const StorageServiceToken = Symbol('StorageService')

export interface StorageService {
  upload(params: { key: string; body: Buffer; contentType: string }): Promise<{
    key: string
    url: string
  }>
}
