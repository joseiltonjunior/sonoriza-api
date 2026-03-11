export const FileSignerServiceToken = Symbol('FileSignerService')

export interface FileSignerService {
  sign(url: string): Promise<string>
}
