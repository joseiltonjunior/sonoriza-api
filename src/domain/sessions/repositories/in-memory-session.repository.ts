import { Session } from '../entities/session'
import { SessionRepository } from './session-repository'

export class InMemorySessionRepository implements SessionRepository {
  public items: Session[] = []

  async create(session: Session): Promise<void> {
    this.items.push(session)
  }

  async findByRefreshTokenJti(refreshTokenJti: string): Promise<Session | null> {
    const session = this.items.find(
      (item) => item.refreshTokenJti === refreshTokenJti,
    )

    return session ?? null
  }

  async update(session: Session): Promise<void> {
    const index = this.items.findIndex((item) => item.id === session.id)

    if (index >= 0) {
      this.items[index] = session
    }
  }
}
