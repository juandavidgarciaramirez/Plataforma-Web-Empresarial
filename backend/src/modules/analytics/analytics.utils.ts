import { Channel, EXCLUDED_PATH_PREFIXES } from './analytics.constants';

/* ---------------------------------------------------------------------------
 * Agente de usuario: solo categorías gruesas (tipo de dispositivo, familia de
 * navegador y sistema). El texto completo del User-Agent no se guarda.
 * ------------------------------------------------------------------------- */

const BOT_PATTERN =
  /bot\b|bot\/|crawl|spider|slurp|bingpreview|mediapartners|facebookexternalhit|facebookcatalog|embedly|quora link preview|outbrain|vkshare|w3c_validator|whatsapp|telegrambot|skypeuripreview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|python-requests|python-urllib|curl\/|wget\/|axios\/|node-fetch|undici|go-http-client|java\/|okhttp|libwww|httpclient|phantomjs|selenium|puppeteer|playwright|prerender/i;

export function isBotUserAgent(userAgent: string): boolean {
  return !userAgent || userAgent.length < 20 || BOT_PATTERN.test(userAgent);
}

export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
}

export function parseUserAgent(ua: string): DeviceInfo {
  const isTablet = /iPad|Tablet|PlayBook|Silk|Kindle|(Android(?!.*Mobile))/i.test(ua);
  const isMobile = !isTablet && /Mobi|iPhone|iPod|Android.*Mobile|Windows Phone|IEMobile|Opera Mini/i.test(ua);

  let browser = 'Otro';
  if (/Edg(e|A|iOS)?\//.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/SamsungBrowser\//.test(ua)) browser = 'Samsung Internet';
  else if (/Firefox\/|FxiOS\//.test(ua)) browser = 'Firefox';
  else if (/Chrome\/|CriOS\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua) && /Version\//.test(ua)) browser = 'Safari';

  let os = 'Otro';
  if (/Windows NT/.test(ua)) os = 'Windows';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/CrOS/.test(ua)) os = 'ChromeOS';
  else if (/Mac OS X|Macintosh/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  return { deviceType: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop', browser, os };
}

/* ---------------------------------------------------------------------------
 * Ubicación aproximada: SOLO si la infraestructura delante del backend la
 * entrega en una cabecera (Cloudflare, Vercel u otra configurable). El
 * backend no consulta bases de geolocalización por IP ni guarda la IP.
 * ------------------------------------------------------------------------- */

export function readGeo(headers: Record<string, string | string[] | undefined>): { country: string | null; region: string | null } {
  const header = (name: string) => {
    const value = headers[name.toLowerCase()];
    return (Array.isArray(value) ? value[0] : value)?.trim() || null;
  };
  const countryHeader = process.env.ANALYTICS_COUNTRY_HEADER;
  const rawCountry = (countryHeader && header(countryHeader)) || header('cf-ipcountry') || header('x-vercel-ip-country');
  const country = rawCountry && /^[A-Z]{2}$/i.test(rawCountry) && !/^(XX|T1)$/i.test(rawCountry) ? rawCountry.toUpperCase() : null;
  const rawRegion = header('x-vercel-ip-country-region') || header('cf-region');
  const region = country && rawRegion ? safeDecode(rawRegion).slice(0, 100) : null;
  return { country, region };
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/* ---------------------------------------------------------------------------
 * Rutas y fuentes de tráfico
 * ------------------------------------------------------------------------- */

/** Ruta pública normalizada (sin query ni hash), o null si no debe contarse. */
export function normalizePath(raw: string): string | null {
  const path = raw.split(/[?#]/)[0].replace(/\/{2,}/g, '/');
  if (!path.startsWith('/') || path.length > 300) return null;
  // Solo caracteres válidos en una ruta URL (evita que un script inyecte texto arbitrario en los informes).
  if (!/^[A-Za-z0-9\-._~%!$&'()*+,;=:/]*$/.test(path)) return null;
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
  const lower = clean.toLowerCase();
  if (EXCLUDED_PATH_PREFIXES.some((prefix) => lower === prefix || lower.startsWith(`${prefix}/`))) return null;
  // Archivos estáticos (imágenes, sitemap, robots, etc.).
  if (/\.[a-z0-9]{2,5}$/i.test(lower)) return null;
  return clean;
}

export interface Attribution {
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  /** El navegador detectó un identificador de clic publicitario (gclid, fbclid, msclkid…); el valor no se envía. */
  paidClick: boolean;
}

const SEARCH_ENGINES = /(^|\.)(google\.[a-z.]+|bing\.com|yahoo\.[a-z.]+|duckduckgo\.com|ecosia\.org|yandex\.[a-z.]+|baidu\.com|search\.brave\.com|startpage\.com|qwant\.com)$/i;
const SOCIAL_NETWORKS = /(^|\.)(facebook\.com|fb\.com|fb\.me|instagram\.com|linkedin\.com|lnkd\.in|t\.co|twitter\.com|x\.com|youtube\.com|youtu\.be|tiktok\.com|pinterest\.[a-z.]+|whatsapp\.com|wa\.me|threads\.net|reddit\.com)$/i;
const PAID_MEDIUMS = /^(cpc|ppc|cpm|cpv|cpa|paid|paidsearch|paid[-_ ]?search|paid[-_ ]?social|paidsocial|display|banner|retargeting|remarketing|ads?)$/i;
const EMAIL_MEDIUMS = /^(e-?mail|newsletter|mailing|correo)$/i;
const SOCIAL_MEDIUMS = /^(social|social[-_ ]?(network|media)|sm|organic[-_ ]?social|rrss|redes)$/i;
const SOCIAL_SOURCES = /^(facebook|fb|instagram|ig|linkedin|twitter|x|youtube|tiktok|whatsapp|pinterest)$/i;

/** Canal de llegada a partir del referente y los parámetros UTM (mismas reglas para todo el histórico). */
export function classifyChannel(attribution: Attribution): Channel {
  const { referrerHost, utmSource, utmMedium, utmCampaign, paidClick } = attribution;
  if (paidClick || (utmMedium && PAID_MEDIUMS.test(utmMedium))) return 'paid';
  if (utmMedium && EMAIL_MEDIUMS.test(utmMedium)) return 'email';
  if ((utmMedium && SOCIAL_MEDIUMS.test(utmMedium)) || (utmSource && SOCIAL_SOURCES.test(utmSource))) return 'social';
  if (utmSource || utmMedium || utmCampaign) return 'campaign';
  if (referrerHost) {
    if (SEARCH_ENGINES.test(referrerHost)) return 'organic_search';
    if (SOCIAL_NETWORKS.test(referrerHost)) return 'social';
    return 'referral';
  }
  return 'direct';
}
