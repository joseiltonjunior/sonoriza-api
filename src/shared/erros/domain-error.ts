export abstract class DomainError extends Error {
  abstract readonly code: string
  abstract readonly status: number
  readonly isReportable: boolean

  protected constructor(message: string, options?: { isReportable?: boolean }) {
    super(message)
    this.isReportable = options?.isReportable ?? false
  }
}
