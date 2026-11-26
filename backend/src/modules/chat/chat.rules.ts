import { isEmail } from 'class-validator';
import {
  ADVISOR_INTENT_WORDS,
  CHAT_SERVICES,
  ChatServiceKnowledge,
  GREETING_PHRASES,
  INDUSTRY_KEYWORDS,
  NEGATIVE_WORDS,
  NO_COMPANY_ANSWER,
  POSITIVE_WORDS,
} from './chat.constants';

/**
 * Funciones puras del motor de reglas de Yuri — sin efectos secundarios, sin
 * red, sin IA (sección 18 del brief). Adaptación server-side del motor que
 * ya vive en el frontend (`src/lib/chatbot/engine.ts`), pero aquí produce un
 * único mensaje de texto por turno (el contrato del API es un string, no una
 * lista de bloques) en vez de una serie de burbujas de chat.
 */

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}

const NAME_RE = /\b(?:me llamo|mi nombre es|soy)\s+([a-zA-ZÁÉÍÓÚÑÜáéíóúñü]{2,20})/i;
const NAME_STOPWORDS = new Set([
  'de', 'del', 'una', 'un', 'el', 'la', 'los', 'las', 'parte', 'cliente',
  'representante', 'gerente', 'director', 'encargado', 'encargada', 'nuevo',
  'nueva', 'empresa', 'compania', 'dueno', 'duena',
]);

export function extractName(rawText: string): { name?: string; rest: string } {
  const match = rawText.match(NAME_RE);
  if (!match || match.index === undefined) return { rest: rawText };
  const candidate = match[1];
  if (NAME_STOPWORDS.has(candidate.toLowerCase())) return { rest: rawText };
  const name = candidate[0].toUpperCase() + candidate.slice(1).toLowerCase();
  const rest = (rawText.slice(0, match.index) + rawText.slice(match.index + match[0].length)).trim();
  return { name, rest };
}

const COMPANY_RE = /\b(?:mi empresa es|la empresa se llama|represento a|trabajo en)\s+([a-zA-ZÁÉÍÓÚÑÜáéíóúñü0-9 .&-]{2,40})/i;

export function extractCompany(rawText: string): string | undefined {
  const match = rawText.match(COMPANY_RE);
  if (!match) return undefined;
  return match[1].trim().replace(/[.,;]+$/, '');
}

/**
 * Respuestas "sueltas" a una pregunta directa del flujo de cotización
 * (p. ej. "Carlos Pérez" tras "¿Con quién tengo el gusto?"). Solo se usan
 * cuando el motor está esperando ese dato; fuera de ese contexto un texto
 * corto no debe interpretarse como nombre ni como empresa.
 */
const BARE_NAME_RE = /^[a-zA-ZÁÉÍÓÚÑÜáéíóúñü]{2,20}(?:\s+[a-zA-ZÁÉÍÓÚÑÜáéíóúñü]{2,20}){0,3}$/;
const BARE_ANSWER_STOPWORDS = new Set([
  ...NAME_STOPWORDS, ...GREETING_PHRASES, ...POSITIVE_WORDS, ...NEGATIVE_WORDS,
]);

export function extractBareName(rawText: string): string | undefined {
  const candidate = rawText.trim().replace(/[.,;!]+$/, '');
  // 60 = MaxLength de `name` en ChatContextDto: el cliente reenvía este valor en el siguiente turno.
  if (candidate.length > 60 || !BARE_NAME_RE.test(candidate)) return undefined;
  if (BARE_ANSWER_STOPWORDS.has(normalize(candidate))) return undefined;
  const words = candidate.split(/\s+/);
  if (NAME_STOPWORDS.has(normalize(words[0]))) return undefined;
  return words.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export function extractBareCompany(rawText: string): string | undefined {
  const candidate = rawText
    .trim()
    // Solo introducciones inequívocas: "Empresa Andina SAS" es un nombre, no "empresa" + nombre.
    .replace(/^(?:es|se llama|la empresa es|la empresa se llama)\s+/i, '')
    .replace(/[.,;!]+$/, '')
    .trim();
  if (candidate.length < 2 || candidate.length > 80) return undefined;
  if (candidate.includes('@') || !/[a-zA-ZÁÉÍÓÚÑÜáéíóúñü]/.test(candidate)) return undefined;
  if (BARE_ANSWER_STOPWORDS.has(normalize(candidate))) return undefined;
  return candidate;
}

/** Respuestas exactas: por sí solas podrían formar parte del nombre de una empresa real ("Independiente SAS"). */
const NO_COMPANY_EXACT = new Set([
  'no', 'nada', 'ninguna', 'ninguno', 'na', 'n/a', 'no aplica', 'no tengo', 'no tenemos',
  'independiente', 'particular', normalize(NO_COMPANY_ANSWER),
]);
const NO_COMPANY_PHRASE_RE =
  /\b(?:sin empresa|ninguna empresa|no tengo empresa|no tenemos empresa|no represento|persona natural|a titulo personal|soy independiente|trabajador independiente|trabajadora independiente)\b/;

/** El visitante responde a "¿a qué empresa representas?" indicando que no tiene ninguna. */
export function isNoCompanyAnswer(rawText: string): boolean {
  const text = normalize(rawText).replace(/[.,;!]+$/, '');
  return NO_COMPANY_EXACT.has(text) || NO_COMPANY_PHRASE_RE.test(text);
}

/** Nombre de la empresa declarada, o `null` si el visitante indicó que no tiene ninguna. */
export function declaredCompany(company: string | null | undefined): string | null {
  return company && company !== NO_COMPANY_ANSWER ? company : null;
}

export function extractEmail(rawText: string): string | undefined {
  const match = rawText.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  );
  const email = match?.[0]?.toLowerCase();

  // Mismo validador que `@IsEmail()` en ChatContextDto: un correo que el DTO
  // rechazaría no se acepta aquí, porque el cliente lo reenvía en el siguiente turno.
  return email && email.length <= 254 && isEmail(email) ? email : undefined;
}

export function extractPhone(rawText: string): string | undefined {
  // Captura números colombianos de 10 dígitos — móviles (3xx) y fijos
  // (60x) — con o sin el prefijo internacional +57.
  const match = rawText.match(
    /(?:\+?57[\s().-]*)?(?:3(?:[\s().-]*\d){9}|6[\s().-]*0(?:[\s().-]*\d){8})/,
  );

  if (!match) return undefined;

  const digits = match[0].replace(/\D/g, '');

  if (digits.length === 12 && /^57[36]/.test(digits)) {
    return `+${digits}`;
  }

  if (digits.length === 10 && /^(?:3|60)/.test(digits)) {
    return digits;
  }

  return undefined;
}

export function detectIndustry(normalizedText: string): string | undefined {
  for (const [keyword, label] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (normalizedText.includes(keyword)) return label;
  }
  return undefined;
}

export function detectService(normalizedText: string): ChatServiceKnowledge | undefined {
  let best: { service: ChatServiceKnowledge; score: number } | undefined;
  for (const service of CHAT_SERVICES) {
    const score = service.keywords.reduce((acc, kw) => acc + (normalizedText.includes(kw) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { service, score };
  }
  return best?.service;
}

export function detectNeed(normalizedText: string): string | undefined {
  const needs: Record<string, string[]> = {
    implementar: [
      'implementar',
      'implementar desde cero',
      'crear desde cero',
      'poner en marcha',
    ],

    actualizar: [
      'actualizar',
      'desactualizado',
      'desactualizada',
      'actualizacion',
      'poner al dia',
      'fortalecer',
      'mejorar',
    ],

    capacitar: [
      'capacitar',
      'capacitación',
      'capacitacion',
      'formacion',
      'entrenamiento',
      'curso',
      'taller',
    ],

    seleccionar_personal: [
      'seleccionar personal',
      'seleccion de personal',
      'selección de personal',
      'reclutamiento',
      'reclutar',
      'cubrir una vacante',
      'contratar personal',
    ],

    seguridad_vial: [
      'seguridad vial',
      'pesv',
      'riesgo vial',
      'siniestro vial',
      'accidente de transito',
    ],

    gestion_sst: [
      'sst',
      'sg-sst',
      'sgsst',
      'seguridad y salud',
      'riesgo laboral',
      'riesgos laborales',
    ],

    contabilidad: [
      'contabilidad',
      'contable',
      'contabilidad empresarial',
    ],

    nomina: [
      'nomina',
      'nómina',
      'pago de nomina',
    ],

    tributario: [
      'tributario',
      'tributaria',
      'impuestos',
    ],
  };

  for (const [need, keywords] of Object.entries(needs)) {
    if (includesAny(normalizedText, keywords)) {
      return need;
    }
  }

  return undefined;
}

export function detectProblem(normalizedText: string): string | undefined {
  const problems: Record<string, string[]> = {
    conductores: [
      'conductores',
      'conductor',
      'comportamiento de los conductores',
      'gestion de conductores',
    ],

    vehiculos: [
      'vehiculos',
      'vehículo',
      'vehiculo',
      'mantenimiento de vehiculos',
      'mantenimiento de vehículos',
    ],

    documentacion: [
      'documentacion',
      'documentación',
      'documentos',
      'papeles',
    ],

    cumplimiento: [
      'cumplimiento',
      'incumplimiento',
      'requisitos',
      'normativa',
      'normatividad',
    ],

    accidentes: [
      'accidentes',
      'accidente',
      'siniestros',
    ],

    personal: [
      'personal',
      'empleados',
      'colaboradores',
      'trabajadores',
    ],

    procesos: [
      'proceso',
      'procesos',
      'operacion',
      'operación',
    ],
  };

  for (const [problem, keywords] of Object.entries(problems)) {
    if (includesAny(normalizedText, keywords)) {
      return problem;
    }
  }

  return undefined;
}

export function isAffirmative(normalizedText: string): boolean {
  return includesAny(normalizedText, POSITIVE_WORDS);
}

export function isNegative(normalizedText: string): boolean {
  return includesAny(normalizedText, NEGATIVE_WORDS);
}

export function wantsAdvisor(normalizedText: string): boolean {
  return includesAny(normalizedText, ADVISOR_INTENT_WORDS);
}
