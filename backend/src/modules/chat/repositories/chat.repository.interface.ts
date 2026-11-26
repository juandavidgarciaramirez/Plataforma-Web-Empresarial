import { ChatSessionEntity, ChatSessionUpdate } from '../entities/chat-session.entity';

/**
 * Contrato de persistencia del contexto de conversación de Yuri (Etapa 16 —
 * `chat.chat_sessions`/`chat_context`/`chat_messages`/`handovers`, ya
 * existían sin usar, hallazgo de la Etapa 13 confirmado al revisar
 * pendientes).
 */
export interface ChatRepository {
  findById(id: string): Promise<ChatSessionEntity | null>;
  /** Crea la sesión si no existe y aplica `data` sobre ella (merge parcial). */
  upsert(id: string, data: ChatSessionUpdate): Promise<ChatSessionEntity>;
  /** Registra un mensaje real de la conversación (usuario o asistente). */
  logMessage(
    sessionId: string,
    senderType: 'user' | 'assistant',
    content: string,
    options?: { intentCode?: string | null; serviceId?: string | null },
  ): Promise<void>;
  /** Registra que Yuri transfirió (o intentó transferir) la conversación a un humano. */
  logHandover(sessionId: string, reason: string): Promise<void>;
  /** Enlaza la sesión con el lead que generó (`chat.chat_sessions.lead_id`). Un fallo aquí no invalida el lead. */
  linkLead(sessionId: string, leadId: string): Promise<void>;
}

export const CHAT_REPOSITORY = 'CHAT_REPOSITORY';
