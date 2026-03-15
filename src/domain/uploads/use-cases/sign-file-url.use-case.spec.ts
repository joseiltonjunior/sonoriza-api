import { FileSignerService } from '../ports/file-signer.service'
import { SignFileUrlUseCase } from './sign-file-url.use-case'

class FakeFileSignerService implements FileSignerService {
  async sign(url: string) {
    return `${url}?signed=true`
  }
}

describe('SignFileUrlUseCase', () => {
  it('should return a signed url for the provided file url', async () => {
    const useCase = new SignFileUrlUseCase(new FakeFileSignerService())

    const result = await useCase.execute({
      url: 'https://cdn.sonoriza.com/musics/paulo-pires/louvor.mp3',
    })

    expect(result).toEqual({
      signedUrl:
        'https://cdn.sonoriza.com/musics/paulo-pires/louvor.mp3?signed=true',
    })
  })
})

