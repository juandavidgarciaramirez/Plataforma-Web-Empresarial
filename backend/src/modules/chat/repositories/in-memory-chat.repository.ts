import { Injectable } from '@nestjs/common';

import { ChatSessionEntity, ChatSessionUpdate } from '../entities/chat-session.entity';
import { ChatRepository } from './chat.repository.interface';

/**
 * Implementación TEMPORAL en memoria de `ChatRepository`.
 * NO toca PostgreSQL.
 */
@Injectable()
export class InMemoryChatRepository implements ChatRepository {
  private readonly sessions = new Map<string, ChatSessionEntity>();

  async findById(id: string): Promise<ChatSessionEntity | null> {
    return this.sessions.get(id) ?? null;
  }

  async upsert(
    id: string,
    data: ChatSessionUpdate,
  ): Promise<ChatSessionEntity> {
    const now = new Date();
    const existing = this.sessions.get(id);

    const updated: ChatSessionEntity = existing
      ? {
          ...existing,
          ...data,
          problem: data.problem ?? existing.problem ?? null,
          updatedAt: now,
        }
      : {
          id,
          name: data.name ?? null,
          company: data.company ?? null,
          email: data.email ?? null,
          phone: data.phone ?? null,
          industry: data.industry ?? null,
          serviceId: data.serviceId ?? null,
          intent: data.intent ?? null,
          need: data.need ?? null,
          problem: data.problem ?? null,
          pendingQuestion: data.pendingQuestion ?? null,
          createdAt: now,
          updatedAt: now,
        };

    this.sessions.set(id, updated);

    return updated;
  }

  /**
   * No-op: esta implementación se conserva como referencia histórica.
   */
  async logMessage(): Promise<void> {}

  /**
   * No-op: esta implementación se conserva como referencia histórica.
   */
  async logHandover(): Promise<void> {}

  /**
   * No-op: esta implementación se conserva como referencia histórica.
   */
  async linkLead(): Promise<void> {}
}