/**
 * Contexto de conversación persistido por `sessionId`.
 */
export interface ChatSessionEntity {
  id: string;

  // Datos identificativos
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;

  // Contexto del negocio
  industry: string | null;
  serviceId: string | null;
  need: string | null;
  problem: string | null;

  // Estado conversacional
  intent: string | null;
  pendingQuestion: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export type ChatSessionUpdate = Partial<
  Pick<
    ChatSessionEntity,
    | 'name'
    | 'company'
    | 'email'
    | 'phone'
    | 'industry'
    | 'serviceId'
    | 'need'
    | 'problem'
    | 'intent'
    | 'pendingQuestion'
  >
>;