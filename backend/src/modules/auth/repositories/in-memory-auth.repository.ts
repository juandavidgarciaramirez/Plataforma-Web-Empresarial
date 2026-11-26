import { Injectable } from '@nestjs/common';
import { AuthRepository, RefreshSession } from './auth.repository.interface';

/**
 * Implementación TEMPORAL en memoria de `AuthRepository` (sesiones /
 * refresh tokens). Se pierde al reiniciar el proceso — suficiente para
 * probar toda la lógica de auth mientras se define PostgreSQL.
 */
@Injectable()
export class InMemoryAuthRepository implements AuthRepository {
  private readonly sessions = new Map<string, RefreshSession>();

  async createSession(data: { id: string; userId: string; expiresAt: Date }): Promise<RefreshSession> {
    const session: RefreshSession = { ...data, revoked: false, createdAt: new Date() };
    this.sessions.set(session.id, session);
    return session;
  }

  async findSessionById(id: string): Promise<RefreshSession | null> {
    return this.sessions.get(id) ?? null;
  }

  async revokeSession(id: string): Promise<void> {
    const session = this.sessions.get(id);
    if (session) {
      session.revoked = true;
    }
  }

  async revokeAllForUser(userId: string): Promise<void> {
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        session.revoked = true;
      }
    }
  }
}
