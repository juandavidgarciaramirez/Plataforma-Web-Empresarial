import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ASSISTANT_NAME,
  CAREERS_PHRASES,
  CHAT_CONTACT,
  CHAT_ROUTES,
  CHAT_SERVICES,
  CONTACT_PHRASES,
  ChatIntent,
  DEFAULT_SUGGESTIONS,
  EMAIL_SUBJECT,
  GREETING_PHRASES,
  HUMAN_AGENT_PHRASES,
  NO_COMPANY_ANSWER,
  PQR_PHRASES,
  QUOTE_PHRASES,
  findServiceById,
} from './chat.constants';
import {
  declaredCompany,
  detectIndustry,
  detectService,
  detectNeed,
  detectProblem,
  extractBareCompany,
  extractBareName,
  extractCompany,
  extractEmail,
  extractPhone,
  extractName,
  includesAny,
  isNegative,
  isAffirmative,
  isNoCompanyAnswer,
  normalize,
  wantsAdvisor,
} from './chat.rules';
import { CHAT_REPOSITORY, ChatRepository } from './repositories/chat.repository.interface';
import { ChatSessionEntity, ChatSessionUpdate } from './entities/chat-session.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatReplyDto } from './dto/chat-reply.dto';
import { LeadsService } from '../crm/leads/leads.service';
import { safeErrorSummary } from '../../common/utils/safe-error.util';

/** Frases que expresan otra intención y por tanto nunca son una respuesta de nombre/empresa. */
const INTERRUPTING_PHRASES = [
  ...HUMAN_AGENT_PHRASES,
  ...QUOTE_PHRASES,
  ...PQR_PHRASES,
  ...CAREERS_PHRASES,
  ...CONTACT_PHRASES,
  ...DEFAULT_SUGGESTIONS.map(normalize),
];

interface EngineOutcome {
  message: string;
  intent: ChatIntent;
  serviceId: string | null;
  suggestions: string[];
  escalateToHuman: boolean;
  leadIntent: boolean;
  pendingQuestion: string | null;
  link: { label: string; href: string } | null;
}

/**
 * Motor de conversación de Yuri (Fase 16-23 del brief): reglas + contexto +
 * detección de intención + catálogo de servicios. Sin IA, sin embeddings,
 * sin llamadas de red — primera versión conforme a la sección 18.
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject(CHAT_REPOSITORY) private readonly chatRepository: ChatRepository,
    private readonly leadsService: LeadsService,
  ) {}

  async handleMessage(dto: SendMessageDto): Promise<ChatReplyDto> {
    let session = await this.chatRepository.findById(dto.sessionId);
    if (!session) {
      session = await this.chatRepository.upsert(dto.sessionId, {});
    }

    session = this.fillGaps(session, dto.context);

    const rawText = dto.message ?? '';
    const trimmed = rawText.trim();

    if (!trimmed) {
      return this.toReply(session, {
        message: '¿Puedes contarme un poco más sobre lo que necesitas?',
        intent: 'unknown',
        serviceId: session.serviceId,
        suggestions: DEFAULT_SUGGESTIONS,
        escalateToHuman: false,
        leadIntent: false,
        pendingQuestion: session.pendingQuestion,
        link: null,
      });
    }

    // Una respuesta "suelta" solo cuenta como nombre/empresa si Yuri acaba de
    // preguntarlo y el mensaje no es otra intención (p. ej. "Hablar con un asesor").
    const acceptsBareAnswer = !includesAny(normalize(trimmed), INTERRUPTING_PHRASES);
    // "Soy independiente" responde a la pregunta por la empresa: no es un nombre.
    const answersNoCompany =
      session.pendingQuestion === 'quote_company' && acceptsBareAnswer && isNoCompanyAnswer(trimmed);
    const { name: explicitName, rest } = answersNoCompany
      ? { name: undefined, rest: trimmed }
      : extractName(trimmed);
    const name =
      explicitName ??
      (session.pendingQuestion === 'quote_name' && acceptsBareAnswer ? extractBareName(trimmed) : undefined);
    const company = answersNoCompany
      ? NO_COMPANY_ANSWER
      : extractCompany(trimmed) ??
        (session.pendingQuestion === 'quote_company' && acceptsBareAnswer ? extractBareCompany(trimmed) : undefined);
    const email = extractEmail(trimmed);
    const phone = extractPhone(trimmed);
    const normalizedText = normalize(rest);
    const industry = detectIndustry(normalizedText);
    const detectedNeed = detectNeed(normalizedText);
    const detectedProblem = detectProblem(normalizedText);
    const hasResidualText = rest.trim().length > 0;

    const outcome = this.resolveOutcome(
        session,
        normalizedText,
        name,
        company,
        email,
        phone,
        hasResidualText,
        detectedNeed,
        detectedProblem,
    );

    const update: ChatSessionUpdate = {
      name: name ?? session.name,
      company: company ?? session.company,
      email: email ?? session.email,
      phone: phone ?? session.phone,
      industry: industry ?? session.industry,
      serviceId: outcome.serviceId,
      intent: outcome.intent,
      need: detectedNeed ?? session.need,
      problem: detectedProblem ?? session.problem,
      pendingQuestion: outcome.pendingQuestion,
    };

    const updated = await this.chatRepository.upsert(dto.sessionId, update);

    await this.chatRepository.logMessage(dto.sessionId, 'user', trimmed, {
      intentCode: outcome.intent,
      serviceId: outcome.serviceId,
    });

    let finalOutcome = outcome;
    if (outcome.leadIntent) {
      const saved = await this.captureLead(dto.sessionId, updated, outcome.serviceId);
      if (!saved) {
        // No se presenta como registrada una cotización que no llegó al CRM. Los datos
        // siguen en la sesión, así que "Solicitar cotización" reintenta el registro.
        finalOutcome = {
          ...outcome,
          message:
            `${updated.name ?? 'Gracias'}, tengo tus datos en esta conversación, pero no pude registrar la solicitud ` +
            'en nuestro sistema en este momento. Para que no se pierda, escríbele directamente a nuestro equipo ' +
            'comercial por WhatsApp o correo con los botones de abajo, o vuelve a intentarlo con "Solicitar cotización".',
          suggestions: ['Solicitar cotización', 'Hablar con un asesor'],
          leadIntent: false,
        };
      }
    }

    if (finalOutcome.escalateToHuman) {
      await this.chatRepository.logHandover(dto.sessionId, finalOutcome.intent);
    }

    const message =
      name && finalOutcome.intent !== 'greeting' && finalOutcome.intent !== 'quote'
        ? `Mucho gusto, ${name}. ${finalOutcome.message}`
        : finalOutcome.message;

    await this.chatRepository.logMessage(dto.sessionId, 'assistant', message, {
      intentCode: finalOutcome.intent,
      serviceId: finalOutcome.serviceId,
    });

    return this.toReply(updated, { ...finalOutcome, message });
  }

  /** Rellena los campos vacíos de la sesión con lo que el cliente envió (nunca sobreescribe lo ya conocido). */
  private fillGaps(
  session: ChatSessionEntity,
  incoming: SendMessageDto['context'],
): ChatSessionEntity {
  if (!incoming) return session;

  return {
    ...session,
    name: session.name ?? incoming.name ?? null,
    company: session.company ?? incoming.company ?? null,
    email: session.email ?? incoming.email ?? null,
    phone: session.phone ?? incoming.phone ?? null,
    industry: session.industry ?? incoming.industry ?? null,
    serviceId: session.serviceId ?? incoming.service ?? null,
    need: session.need ?? incoming.need ?? null,
    problem: session.problem ?? incoming.problem ?? null,
  };
}

  private resolveOutcome(
    session: ChatSessionEntity,
    normalizedText: string,
    detectedName: string | undefined,
    detectedCompany: string | undefined,
    detectedEmail: string | undefined,
    detectedPhone: string | undefined,
    hasResidualText: boolean,
    detectedNeed?: string,
    detectedProblem?: string,
  ): EngineOutcome {
    // 0) Respuesta directa a una pregunta del flujo de cotización. Va antes de
    //    las intenciones "duras" para que, p. ej., "mi correo electrónico es ..."
    //    no se interprete como una solicitud de los datos de contacto.
    const pending = session.pendingQuestion;
    const answersPendingQuote =
      (pending === 'quote_service' && Boolean(detectService(normalizedText))) ||
      (pending === 'quote_name' && Boolean(detectedName)) ||
      (pending === 'quote_company' && Boolean(detectedCompany)) ||
      (pending === 'quote_email' && Boolean(detectedEmail)) ||
      (pending === 'quote_phone' && Boolean(detectedPhone));

    if (answersPendingQuote) {
      return this.resolvePendingQuestion(
        session,
        normalizedText,
        detectedName,
        detectedCompany,
        detectedEmail,
        detectedPhone,
        detectedNeed,
        detectedProblem,
      );
    }

    // 1) Intenciones "duras" — pueden interrumpir cualquier flujo en curso.
    if (includesAny(normalizedText, HUMAN_AGENT_PHRASES)) {
      return {
        message: 'Claro. Puedo conectarte con nuestro equipo. ¿Cómo prefieres continuar: WhatsApp o correo?',
        intent: 'human_agent',
        serviceId: session.serviceId,
        suggestions: [],
        escalateToHuman: true,
        leadIntent: false,
        pendingQuestion: null,
        link: null,
      };
    }

    if (includesAny(normalizedText, QUOTE_PHRASES)) {
      return this.nextQuoteStep(
        {
          serviceId: detectService(normalizedText)?.id ?? session.serviceId,
          name: detectedName ?? session.name,
          company: detectedCompany ?? session.company,
          email: detectedEmail ?? session.email,
          phone: detectedPhone ?? session.phone,
        },
        null,
      );
    }

    if (includesAny(normalizedText, PQR_PHRASES)) {
      return {
        message: 'Para radicar una PQR contamos con un espacio dedicado donde tu solicitud queda registrada formalmente.',
        intent: 'pqr',
        serviceId: session.serviceId,
        suggestions: DEFAULT_SUGGESTIONS,
        escalateToHuman: false,
        leadIntent: false,
        pendingQuestion: null,
        link: { label: 'Ir a PQR', href: CHAT_ROUTES.pqr },
      };
    }

    if (includesAny(normalizedText, CAREERS_PHRASES)) {
      return {
        message: '¡Qué bueno que quieras sumarte al equipo! Postúlate directamente en nuestra sección de vacantes.',
        intent: 'careers',
        serviceId: session.serviceId,
        suggestions: DEFAULT_SUGGESTIONS,
        escalateToHuman: false,
        leadIntent: false,
        pendingQuestion: null,
        link: { label: 'Trabaja con nosotros', href: CHAT_ROUTES.careers },
      };
    }

    if (includesAny(normalizedText, CONTACT_PHRASES)) {
      return {
        message: `Puedes escribirnos por WhatsApp al ${CHAT_CONTACT.whatsapp.display} o por correo a ${CHAT_CONTACT.email.commercial}.`,
        intent: 'contact',
        serviceId: session.serviceId,
        suggestions: DEFAULT_SUGGESTIONS,
        escalateToHuman: true,
        leadIntent: false,
        pendingQuestion: null,
        link: null,
      };
    }

    // 2) Si hay una pregunta pendiente y el mensaje no cambia de tema, respondemos en contexto.
    const detectedService = detectService(normalizedText);
    const changesTopic =
      detectedService && detectedService.id !== session.serviceId;

    if (session.pendingQuestion && !changesTopic) {
      return this.resolvePendingQuestion(
        session,
        normalizedText,
        detectedName,
        detectedCompany,
        detectedEmail,
        detectedPhone,
        detectedNeed,
        detectedProblem,
      );
    }

    // 3) Nuevo servicio detectado.
    if (detectedService) {
      const alreadyActive = session.serviceId === detectedService.id;

      let message = '';

        if (detectedProblem && detectedNeed) {
          message =
            `Entiendo. Identifico que tu necesidad está relacionada con ${detectedService.name}, ` +
            `y que actualmente estás buscando ${detectedNeed.replace(/_/g, ' ')} ` +
            `por una situación relacionada con ${detectedProblem}. ` +
            `${detectedService.followUpQuestion}`;
        } else if (detectedProblem) {
          message =
            `Entiendo. Por lo que me cuentas, ${detectedService.name} puede ayudarte con ese tema. ` +
            `Veo que la situación está relacionada con ${detectedProblem}. ` +
            `${detectedService.followUpQuestion}`;
        } else if (detectedNeed) {
          message =
            `Entiendo. Desde ${detectedService.name} podemos orientarte para ${detectedNeed.replace(/_/g, ' ')}. ` +
            `${detectedService.followUpQuestion}`;
        } else {
          message = alreadyActive
            ? `Sigamos con ${detectedService.name}. ${detectedService.followUpQuestion}`
            : `${detectedService.intro} ${detectedService.followUpQuestion}`;
        }

        return {
          message,
          intent: 'service_inquiry',
          serviceId: detectedService.id,
          suggestions: detectedService.suggestions,
          escalateToHuman: false,
          leadIntent: false,
          pendingQuestion: 'service_followup',
          link: null,
        };
      }

    // 4) Industria reconocida sin servicio puntual (p. ej. "transporte" → Capital Mobility).
    const industry = detectIndustry(normalizedText);
    if (industry === 'transporte' && !session.serviceId) {
      const mobility = findServiceById('capital-mobility')!;
      return {
        message:
          'Como me comentas que trabajas en transporte, probablemente Capital Mobility sea especialmente relevante para tu caso. ¿Quieres que te cuente más o prefieres hablar con un asesor?',
        intent: 'service_inquiry',
        serviceId: mobility.id,
        suggestions: mobility.suggestions,
        escalateToHuman: false,
        leadIntent: false,
        pendingQuestion: 'offer_advisor',
        link: null,
      };
    }

    // 5) Saludo (mensaje corto, sin otra intención detectada).
    if (includesAny(normalizedText, GREETING_PHRASES) && normalizedText.length < 20) {
      return {
        // El chat ya muestra la presentación de Yuri al abrirse; aquí no se repite.
        message: detectedName
          ? `¡Hola, ${detectedName}! ¿En qué puedo ayudarte hoy?`
          : '¡Hola! ¿En qué puedo ayudarte hoy? Puedo orientarte sobre nuestros servicios, preparar una cotización o conectarte con un asesor.',
        intent: 'greeting',
        serviceId: session.serviceId,
        suggestions: DEFAULT_SUGGESTIONS,
        escalateToHuman: false,
        leadIntent: false,
        pendingQuestion: session.pendingQuestion,
        link: null,
      };
    }

    // 6) El mensaje solo presentaba el nombre (p. ej. "Soy Juan") — no hay más texto que analizar.
    if (detectedName && !hasResidualText) {
      return {
        message: `Mucho gusto, ${detectedName}. ¿En qué puedo ayudarte hoy?`,
        intent: 'greeting',
        serviceId: session.serviceId,
        suggestions: DEFAULT_SUGGESTIONS,
        escalateToHuman: false,
        leadIntent: false,
        pendingQuestion: session.pendingQuestion,
        link: null,
      };
    }

    // 7) Nada reconocido.
    return {
      message:
        'No estoy seguro de haber entendido tu necesidad. Puedes contarme qué problema quieres resolver, qué servicio buscas, o con qué tipo de organización trabajas. También puedo conectarte con un asesor.',
      intent: 'unknown',
      serviceId: session.serviceId,
      suggestions: DEFAULT_SUGGESTIONS,
      escalateToHuman: false,
      leadIntent: false,
      pendingQuestion: null,
      link: null,
    };
  }

  private resolvePendingQuestion(
    session: ChatSessionEntity,
    normalizedText: string,
    detectedName?: string,
    detectedCompany?: string,
    detectedEmail?: string,
    detectedPhone?: string,
    detectedNeed?: string,
    detectedProblem?: string,
  ): EngineOutcome {
    if (session.pendingQuestion?.startsWith('quote_')) {
      return this.nextQuoteStep(
        {
          serviceId: detectService(normalizedText)?.id ?? session.serviceId,
          name: detectedName ?? session.name,
          company: detectedCompany ?? session.company,
          email: detectedEmail ?? session.email,
          phone: detectedPhone ?? session.phone,
        },
        session.pendingQuestion,
      );
    }

    if (session.pendingQuestion === 'offer_advisor') {
      if (wantsAdvisor(normalizedText)) {
        return {
          message: 'Claro. Puedo conectarte con nuestro equipo.',
          intent: 'human_agent',
          serviceId: session.serviceId,
          suggestions: [],
          escalateToHuman: true,
          leadIntent: false,
          pendingQuestion: null,
          link: null,
        };
      }

      const service = findServiceById(session.serviceId);
      return {
        message: service
          ? `${service.tagline}. ¿Te gustaría profundizar en algún punto o prefieres hablar con un asesor?`
          : 'Con gusto. ¿Qué te gustaría saber?',
        intent: 'service_inquiry',
        serviceId: session.serviceId,
        suggestions: service ? service.suggestions : DEFAULT_SUGGESTIONS,
        escalateToHuman: false,
        leadIntent: false,
        pendingQuestion: null,
        link: null,
      };
    }

    // Continuación de la pregunta de seguimiento de un servicio (service_followup).
    let ack = 'Entendido, cuéntame un poco más sobre lo que necesitas.';
    if (isNegative(normalizedText)) {
      ack = 'Entendido, podemos acompañarte a construirlo desde cero.';
    } else if (isAffirmative(normalizedText)) {
      ack = 'Perfecto, entonces podemos ayudarte a revisarlo, actualizarlo o fortalecerlo.';
    }

    const service = findServiceById(session.serviceId);
    const currentNeed = detectedNeed ?? session.need;
    const currentProblem = detectedProblem ?? session.problem;

    if (currentNeed || currentProblem) {
      let contextMessage = 'Perfecto. Con eso ya tengo más claro tu caso.';

      if (currentNeed && currentProblem) {
        contextMessage =
          `Perfecto. Entonces estás buscando ${currentNeed.replace(/_/g, ' ')} ` +
          `en un contexto relacionado con ${currentProblem}.`;
      } else if (currentNeed) {
        contextMessage =
          `Perfecto. Entonces tu necesidad está relacionada con ${currentNeed.replace(/_/g, ' ')}.`;
      } else if (currentProblem) {
        contextMessage =
          `Perfecto. Entonces la situación está relacionada con ${currentProblem}.`;
      }

      let contextualQuestion = '¿Qué aspecto quieres revisar primero?';

      if (currentNeed === 'actualizar' && currentProblem === 'conductores') {
        contextualQuestion =
          'Podemos revisar la actualización del PESV y, al mismo tiempo, fortalecer la gestión de conductores. ' +
          '¿La actualización se debe a cambios en la operación, requisitos normativos o hallazgos que necesitan corregir?';
      } else if (currentNeed === 'actualizar') {
        contextualQuestion =
          'Podemos ayudarte a actualizarlo. ¿El cambio responde a modificaciones en la operación, requisitos normativos o hallazgos que necesitan cerrar?';
      } else if (currentProblem === 'conductores') {
        contextualQuestion =
          'También podemos trabajar sobre la gestión de conductores. ¿El principal problema está en desempeño, capacitación, documentación o cumplimiento?';
      } else if (service) {
        contextualQuestion = service.followUpQuestion;
      }

      return {
        message: `${contextMessage} ${contextualQuestion}`,
        intent: 'service_inquiry',
        serviceId: session.serviceId,
        suggestions: service ? service.suggestions : DEFAULT_SUGGESTIONS,
        escalateToHuman: false,
        leadIntent: false,
        pendingQuestion: 'service_followup',
        link: null,
      };
    }

    return {
      message: `${ack} ${
        service
          ? service.followUpQuestion
          : '¿Te gustaría contarme un poco más sobre tu necesidad?'
      }`,
      intent: 'service_inquiry',
      serviceId: session.serviceId,
      suggestions: service ? service.suggestions : DEFAULT_SUGGESTIONS,
      escalateToHuman: false,
      leadIntent: false,
      pendingQuestion: 'service_followup',
      link: null,
    };
  }

  /**
   * Flujo de cotización: pide, en orden, el primer dato que falte (servicio,
   * nombre, empresa, correo, teléfono). Si `pendingQuestion` ya era esa misma
   * pregunta, el usuario no la respondió de forma válida y se reformula en
   * lugar de repetirla igual. Con todo completo, escala al equipo comercial
   * y marca el lead.
   */
  private nextQuoteStep(
    data: {
      serviceId: string | null;
      name: string | null;
      company: string | null;
      email: string | null;
      phone: string | null;
    },
    pendingQuestion: string | null,
  ): EngineOutcome {
    const service = findServiceById(data.serviceId);
    const ask = (step: string, firstAsk: string, reAsk: string, suggestions: string[] = []): EngineOutcome => ({
      message: pendingQuestion === step ? reAsk : firstAsk,
      intent: 'quote',
      serviceId: service?.id ?? null,
      suggestions,
      escalateToHuman: false,
      leadIntent: false,
      pendingQuestion: step,
      link: null,
    });

    if (!service) {
      const serviceNames = CHAT_SERVICES.map((item) => item.name);
      const serviceList = `${serviceNames.slice(0, -1).join(', ')} o ${serviceNames[serviceNames.length - 1]}`;
      // El chat muestra como máximo 3 sugerencias, así que el texto nombra todos los servicios.
      return ask(
        'quote_service',
        `Claro. Con gusto te ayudo con la cotización. ¿Qué servicio necesitas cotizar: ${serviceList}?`,
        `Necesito saber qué servicio quieres cotizar. Puedes indicarme ${serviceList}.`,
        serviceNames,
      );
    }

    if (!data.name) {
      return ask(
        'quote_name',
        `Perfecto. Podemos preparar la cotización de ${service.name}. ¿Con quién tengo el gusto?`,
        'Claro. ¿Me indicas tu nombre, por favor?',
      );
    }

    if (!data.company) {
      return ask(
        'quote_company',
        `Mucho gusto, ${data.name}. Para orientar mejor la cotización, ¿a qué empresa representas?`,
        'Perfecto. ¿Cuál es el nombre de la empresa?',
      );
    }

    if (!data.email) {
      return ask(
        'quote_email',
        'Gracias. ¿Cuál es tu correo electrónico para que nuestro equipo comercial pueda contactarte?',
        'No logré identificar un correo válido. ¿Me lo compartes de nuevo? Por ejemplo: nombre@empresa.com',
      );
    }

    if (!data.phone) {
      return ask(
        'quote_phone',
        'Perfecto. ¿Qué número de teléfono prefieres para que nuestro equipo comercial se comunique contigo?',
        'No logré identificar el número. ¿Me lo compartes con sus 10 dígitos? Por ejemplo: 300 123 4567',
      );
    }

    const company = declaredCompany(data.company);
    return {
      message:
        `Listo, ${data.name}. Registré tu solicitud de cotización de ${service.name}${company ? ` para ${company}` : ''} ` +
        'y quedó a disposición de nuestro equipo comercial. Si quieres avanzar ahora mismo, escríbeles por ' +
        'WhatsApp o correo con los botones de abajo.',
      intent: 'quote',
      serviceId: service.id,
      suggestions: [],
      escalateToHuman: true,
      leadIntent: true,
      pendingQuestion: null,
      link: null,
    };
  }

  /**
   * Genera (o actualiza) el lead de Yuri en el CRM — brief sección "YURI":
   * fuente siempre `YURI`, idempotente por `chatSessionId` (ver
   * `LeadsService.upsertFromChat`). No rompe la conversación: devuelve
   * `false` si el registro falla para que Yuri no lo presente como exitoso,
   * y deja el error en el log del servidor (sin datos personales: el mensaje
   * de un error de Prisma puede incluirlos, ver `safeErrorSummary`).
   */
  private async captureLead(
    sessionId: string,
    session: ChatSessionEntity,
    serviceId: string | null,
  ): Promise<boolean> {
    try {
      const lead = await this.leadsService.upsertFromChat({
        chatSessionId: sessionId,
        name: session.name,
        company: declaredCompany(session.company),
        email: session.email,
        phone: session.phone,
        service: serviceId,
        need: session.need,
      });
      await this.chatRepository.linkLead(sessionId, lead.id);
      return true;
    } catch (error) {
      this.logger.error(`No se pudo registrar el lead de Yuri (sesión ${sessionId}): ${safeErrorSummary(error)}`);
      return false;
    }
  }

  /**
   * Enlaces de WhatsApp y correo. En una cotización el mensaje precargado
   * incluye servicio, nombre y empresa para que el equipo comercial ubique
   * la solicitud — nunca el correo ni el teléfono del visitante.
   */
  private buildChannels(serviceId: string | null, intent: ChatIntent, session: ChatSessionEntity) {
    const service = findServiceById(serviceId);
    const isQuote = intent === 'quote' && service;
    const company = declaredCompany(session.company);
    const quoteMessage = isQuote
      ? [
          `Hola, soy ${session.name ?? 'un visitante del sitio web'}` +
            (company ? ` de ${company}` : '') +
            '.',
          `Solicité a través de Yuri, en el sitio web de Capital Consulting, una cotización de ${service.name}.`,
        ].join(' ')
      : null;
    const waMessage =
      quoteMessage ??
      (service
        ? `Hola, vengo del sitio web de Capital Consulting y quiero recibir asesoría sobre ${service.name}.`
        : 'Hola, vengo del sitio web de Capital Consulting y quiero recibir asesoría.');
    const whatsappUrl = `https://wa.me/${CHAT_CONTACT.whatsapp.number}?text=${encodeURIComponent(waMessage)}`;
    const mailSubject = isQuote ? `Solicitud de cotización - ${service.name}` : EMAIL_SUBJECT;
    const mailUrl =
      `mailto:${CHAT_CONTACT.email.commercial}?subject=${encodeURIComponent(mailSubject)}` +
      (quoteMessage ? `&body=${encodeURIComponent(quoteMessage)}` : '');

    return {
      whatsapp: { label: `WhatsApp (${CHAT_CONTACT.whatsapp.display})`, url: whatsappUrl },
      email: { label: CHAT_CONTACT.email.commercial, url: mailUrl },
    };
  }

  private toReply(session: ChatSessionEntity, outcome: EngineOutcome): ChatReplyDto {
    return {
      message: outcome.message,
      assistant: ASSISTANT_NAME,
      intent: outcome.intent,
      service: outcome.serviceId,
      suggestions: outcome.suggestions,
      escalateToHuman: outcome.escalateToHuman,
      leadIntent: outcome.leadIntent,
      channels: outcome.escalateToHuman ? this.buildChannels(outcome.serviceId, outcome.intent, session) : null,
      link: outcome.link,
      context: {
        name: session.name,
        company: session.company,
        email: session.email,
        phone: session.phone,
        service: outcome.serviceId,
        intent: outcome.intent,
        industry: session.industry,
        need: session.need,
        problem: session.problem,
      },
    };
  }
}
