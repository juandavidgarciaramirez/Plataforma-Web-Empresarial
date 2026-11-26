import { Injectable } from '@nestjs/common';
import { PasswordResetRepository, PasswordResetToken } from './password-reset.repository.interface';

/** Implementación TEMPORAL en memoria de `PasswordResetRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryPasswordResetRepository implements PasswordResetRepository {
  private readonly tokens = new Map<string, PasswordResetToken>();

  async create(data: { token: string; userId: string; expiresAt: Date }): Promise<PasswordResetToken> {
    const entry: PasswordResetToken = { ...data, usedAt: null, createdAt: new Date() };
    this.tokens.set(entry.token, entry);
    return entry;
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    return this.tokens.get(token) ?? null;
  }

  async markUsed(token: string): Promise<void> {
    const entry = this.tokens.get(token);
    if (entry) {
      entry.usedAt = new Date();
    }
  }

  async invalidateAllForUser(userId: string): Promise<void> {
    for (const entry of this.tokens.values()) {
      if (entry.userId === userId && !entry.usedAt) {
        entry.usedAt = new Date();
      }
    }
  }
}
