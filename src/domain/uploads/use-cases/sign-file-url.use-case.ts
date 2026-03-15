import { SignFileUrlDTO } from '../dtos/sign-file-url.dto'
import { SignFileUrlResponseDTO } from '../dtos/sign-file-url-response.dto'
import { FileSignerService } from '../ports/file-signer.service'

export class SignFileUrlUseCase {
  constructor(private readonly fileSignerService: FileSignerService) {}

  async execute({ url }: SignFileUrlDTO): Promise<SignFileUrlResponseDTO> {
    const signedUrl = await this.fileSignerService.sign(url)

    return {
      signedUrl,
    }
  }
}

