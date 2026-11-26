import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { Prisma } from '../../../../prisma/generated';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { ChatSessionEntity, ChatSessionUpdate } from '../entities/chat-session.entity';
import { ChatRepository } from './chat.repository.interface';
import { safeErrorSummary } from '../../../common/utils/safe-error.util';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * El frontend genera `sessionId` con `crypto.randomUUID()` (navegadores
 * modernos); el único fallback (navegador sin esa API) genera un string que
 * NO es UUID. `chat.chat_sessions.id` es una columna UUID nativa real, así
 * que se deriva un UUID determinístico (el mismo string siempre produce el
 * mismo UUID) en vez de fallar o inventar uno aleatorio distinto en cada
 * request.
 */
function toSessionUuid(rawId: string): string {
  if (UUID_REGEX.test(rawId)) return rawId;
  const h = createHash('sha1').update(rawId).digest('hex').slice(0, 32);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

/** `chat.chat_intents.code` reales — 1:1 con `ChatIntent` de `chat.constants.ts`. */
const INTENT_CODE_MAP: Record<string, string> = {
  greeting: 'GREETING',
  service_inquiry: 'SERVICE_INQUIRY',
  quote: 'QUOTE',
  pqr: 'PQR',
  careers: 'CAREERS',
  contact: 'CONTACT',
  human_agent: 'HUMAN_AGENT',
  unknown: 'UNKNOWN',
};
const CODE_TO_INTENT = Object.fromEntries(Object.entries(INTENT_CODE_MAP).map(([k, v]) => [v, k]));

type ChatContextRow = {
  name: string | null;
  company_name: string | null;
  industry: string | null;
  need: string | null;
  context_data: unknown;

  chat_intents?: {
    code: string;
  } | null;

  services?: {
    code: string;
  } | null;

  chat_sessions?: {
    created_at: Date;
    updated_at: Date;
  } | null;
};

/**
 * Implementación real sobre `chat.chat_sessions` + `chat_context` +
 * `chat_messages` + `handovers` (Etapa 16 — existían desde antes,
 * ChatModule usaba InMemoryChatRepository, confirmado al revisar
 * pendientes de la Etapa 13). El motor de reglas de Yuri
 * (`ChatService`/`chat.rules.ts`) no cambia — solo dónde vive el contexto.
 */
@Injectable()
export class PrismaChatRepository implements ChatRepository {
  private readonly logger = new Logger(PrismaChatRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private readonly intentIdCache = new Map<string, string>();
  private readonly serviceIdCache = new Map<string, bigint>();

  async findById(id: string): Promise<ChatSessionEntity | null> {
    const sessionId = toSessionUuid(id);
    const row = await this.prisma.chat_context.findUnique({
      where: { session_id: sessionId },
      include: {
        chat_intents: { select: { code: true } },
        services: { select: { code: true } },
        chat_sessions: { select: { created_at: true, updated_at: true } },
      },
    });
    return row ? this.toEntity(id, row as ChatContextRow) : null;
  }

  async upsert(
  id: string,
  data: ChatSessionUpdate,
): Promise<ChatSessionEntity> {
  const sessionId = toSessionUuid(id);

  await this.prisma.chat_sessions.upsert({
    where: { id: sessionId },
    create: {
      id: sessionId,
      channel: 'WEB',
      status: 'ACTIVE',
    },
    update: {
      last_activity_at: new Date(),
    },
  });

  const [intentId, serviceId] = await Promise.all([
    data.intent !== undefined
      ? this.resolveIntentId(data.intent)
      : Promise.resolve(null),

    data.serviceId !== undefined
      ? this.resolveServiceId(data.serviceId)
      : Promise.resolve(null),
  ]);

  const existingContext = await this.prisma.chat_context.findUnique({
    where: { session_id: sessionId },
    select: { context_data: true },
  });

  const previousContext: Prisma.InputJsonObject =
  existingContext?.context_data &&
  typeof existingContext.context_data === 'object' &&
  !Array.isArray(existingContext.context_data)
    ? (existingContext.context_data as Prisma.InputJsonObject)
    : {};

  const contextData: Prisma.InputJsonObject = {
  ...previousContext,

  ...(data.problem !== undefined
    ? { problem: data.problem }
    : {}),

  ...(data.email !== undefined
    ? { email: data.email }
    : {}),

  ...(data.phone !== undefined
    ? { phone: data.phone }
    : {}),

  ...(data.pendingQuestion !== undefined
    ? { pendingQuestion: data.pendingQuestion }
    : {}),
};

  const row = await this.prisma.chat_context.upsert({
    where: { session_id: sessionId },

    create: {
      session_id: sessionId,
      name: data.name ?? null,
      company_name: data.company ?? null,
      industry: data.industry ?? null,
      need: data.need ?? null,
      service_id: serviceId,
      intent_id: intentId,

      lead_intent: data.intent === 'quote',
      quote_requested: data.intent === 'quote',
      human_requested: data.intent === 'human_agent',
      pqr_requested: data.intent === 'pqr',
      careers_requested: data.intent === 'careers',

      context_data: contextData,
    },

    update: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.company !== undefined && {
        company_name: data.company,
      }),

      ...(data.industry !== undefined && {
        industry: data.industry,
      }),

      ...(data.need !== undefined && {
        need: data.need,
      }),

      ...(data.serviceId !== undefined && {
        service_id: serviceId,
      }),

      ...(data.intent !== undefined && {
        intent_id: intentId,
      }),

      ...(data.intent === 'quote' && {
        lead_intent: true,
        quote_requested: true,
      }),

      ...(data.intent === 'human_agent' && {
        human_requested: true,
      }),

      ...(data.intent === 'pqr' && {
        pqr_requested: true,
      }),

      ...(data.intent === 'careers' && {
        careers_requested: true,
      }),

      context_data: contextData,

      updated_at: new Date(),
    },

    include: {
      chat_intents: {
        select: { code: true },
      },

      services: {
        select: { code: true },
      },

      chat_sessions: {
        select: {
          created_at: true,
          updated_at: true,
        },
      },
    },
  });

  return this.toEntity(id, row as ChatContextRow);
}

  async logMessage(
    sessionId: string,
    senderType: 'user' | 'assistant',
    content: string,
    options?: { intentCode?: string | null; serviceId?: string | null },
  ): Promise<void> {
    try {
      const dbSessionId = toSessionUuid(sessionId);
      const [intentId, serviceId] = await Promise.all([
        this.resolveIntentId(options?.intentCode ?? null),
        this.resolveServiceId(options?.serviceId ?? null),
      ]);
      await this.prisma.chat_messages.create({
        data: {
          session_id: dbSessionId,
          sender_type: senderType.toUpperCase(), // chk_chat_sender_type exige USER|ASSISTANT|HUMAN_AGENT|SYSTEM
          content,
          intent_id: intentId,
          service_id: serviceId,
        },
      });
    } catch (err) {
      // Fire-and-forget: registrar el mensaje nunca debe romper la respuesta de Yuri — pero sí queda en el log.
      this.logger.error(`No se pudo registrar el mensaje de chat: ${safeErrorSummary(err)}`);
    }
  }

  async logHandover(sessionId: string, reason: string): Promise<void> {
    try {
      const dbSessionId = toSessionUuid(sessionId);
      await this.prisma.handovers.create({
        data: { session_id: dbSessionId, channel: 'WEB', reason: reason.toUpperCase(), status: 'REQUESTED' },
      });
    } catch (err) {
      this.logger.error(`No se pudo registrar el handover de chat: ${safeErrorSummary(err)}`);
    }
  }

  async linkLead(sessionId: string, leadId: string): Promise<void> {
    try {
      await this.prisma.chat_sessions.update({
        where: { id: toSessionUuid(sessionId) },
        data: { lead_id: BigInt(leadId), updated_at: new Date() },
      });
    } catch (err) {
      // `crm.leads.campaign` conserva la asociación: un fallo aquí no invalida el lead.
      this.logger.error(`No se pudo enlazar la sesión de chat con el lead ${leadId}: ${safeErrorSummary(err)}`);
    }
  }

  private async resolveIntentId(appIntent: string | null): Promise<string | null> {
    if (!appIntent) return null;
    const code = INTENT_CODE_MAP[appIntent];
    if (!code) return null;
    const cached = this.intentIdCache.get(code);
    if (cached) return cached;
    const row = await this.prisma.chat_intents.findFirst({ where: { code }, select: { id: true } });
    if (row) this.intentIdCache.set(code, row.id);
    return row?.id ?? null;
  }

  private async resolveServiceId(slug: string | null): Promise<bigint | null> {
    if (!slug) return null;
    const cached = this.serviceIdCache.get(slug);
    if (cached) return cached;
    const row = await this.prisma.services.findFirst({ where: { code: slug }, select: { id: true } });
    if (row) this.serviceIdCache.set(slug, row.id);
    return row?.id ?? null;
  }

  private toEntity(appSessionId: string, row: ChatContextRow): ChatSessionEntity {
    const pendingQuestion =
      row.context_data && typeof row.context_data === 'object' && 'pendingQuestion' in row.context_data
        ? ((row.context_data as { pendingQuestion?: string | null }).pendingQuestion ?? null)
        : null;

    const contextData =
      row.context_data &&
      typeof row.context_data === 'object' &&
      !Array.isArray(row.context_data)
        ? (row.context_data as Record<string, unknown>)
        : {};

    return {
      id: appSessionId,
      name: row.name,
      company: row.company_name,
      email:
    typeof contextData.email === 'string'
      ? contextData.email
      : null,
    phone:
    typeof contextData.phone === 'string'
      ? contextData.phone
      : null,
      industry: row.industry,
      serviceId: row.services?.code ?? null,
      intent: row.chat_intents?.code
        ? (CODE_TO_INTENT[row.chat_intents.code] ?? null)
        : null,
      need: row.need,
      problem:
        typeof contextData.problem === 'string'
          ? contextData.problem
          : null,
      pendingQuestion,
      createdAt: row.chat_sessions?.created_at ?? new Date(0),
      updatedAt: row.chat_sessions?.updated_at ?? new Date(0),
    };
  }
}
