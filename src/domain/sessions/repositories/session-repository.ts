import { Session } from '../entities/session'

export interface SessionRepository {
  create(session: Session): Promise<void>
  findByRefreshTokenJti(refreshTokenJti: string): Promise<Session | null>
  update(session: Session): Promise<void>
}

export const SessionRepositoryToken = Symbol('SessionRepository')
