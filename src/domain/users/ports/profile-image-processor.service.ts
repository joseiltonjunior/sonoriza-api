export const ProfileImageProcessorServiceToken = Symbol(
  'ProfileImageProcessorService',
)

export interface ProfileImageProcessorService {
  process(params: { body: Buffer; contentType: string }): Promise<{
    body: Buffer
    contentType: 'image/webp'
  }>
}
