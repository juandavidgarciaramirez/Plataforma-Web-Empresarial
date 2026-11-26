import { isIP } from 'net';
import { Request } from 'express';

/**
 * Identificación del cliente detrás del proxy del hosting.
 *
 * `X-Forwarded-For` lo puede escribir cualquiera: solo es confiable la parte
 * que agregó nuestra propia infraestructura, es decir, las entradas de la
 * DERECHA. Express las resuelve en `request.ip` según la política de
 * `buildTrustProxy` (ver main.ts); nadie más debe leer esa cabecera.
 */

function isLoopback(address: string): boolean {
  const ip = address.replace(/^::ffff:/i, '');
  return ip === '::1' || ip.startsWith('127.');
}

/**
 * Política de `trust proxy` de Express. Con `TRUST_PROXY_HOPS` definido se
 * confía exactamente en esa cantidad de saltos (0 = ignorar la cabecera). Por
 * defecto solo se confía en conexiones locales: el socket interno de Passenger
 * (sin dirección) o loopback. Un cliente conectado directamente desde Internet
 * nunca puede imponer su IP con la cabecera.
 */
export function buildTrustProxy(hopsRaw: string | undefined) {
  const hops = Number.parseInt(hopsRaw ?? '', 10);
  if (Number.isInteger(hops) && hops >= 0) {
    return (_address: string | undefined, index: number) => index < hops;
  }
  return (address: string | undefined) => !address || isLoopback(address);
}

/** IP tal como debe guardarse: sin la forma `::ffff:` de IPv4 sobre un socket IPv6. */
function normalizeIp(ip: string | undefined): string | null {
  const value = ip?.trim();
  return value ? value.replace(/^::ffff:/i, '') : null;
}

/** IP real del cliente para evidencia de sesión y auditoría (secciones 24/43 del encargo). */
export function extractClientIp(request: Request): string {
  return normalizeIp(request.ip) ?? '127.0.0.1';
}

/** Primeros 64 bits de una IPv6: un mismo cliente controla toda esa red y podría rotar direcciones dentro de ella. */
function ipv6Network(ip: string): string {
  const [head, tail] = ip.split('%')[0].split('::');
  const headParts = head ? head.split(':') : [];
  const tailParts = tail ? tail.split(':') : [];
  const zeros = Array<string>(Math.max(8 - headParts.length - tailParts.length, 0)).fill('0');
  const groups = [...headParts, ...zeros, ...tailParts].slice(0, 4);
  return `${groups.map((group) => parseInt(group || '0', 16).toString(16)).join(':')}::/64`;
}

/**
 * Identidad para el rate limiting. Un mismo cliente debe contar una sola vez
 * aunque llegue como `::1`, `127.0.0.1` o `::ffff:127.0.0.1` (la ráfaga de 140
 * peticiones que evadía el límite se repartía justamente entre dos de esas
 * formas). Sin IP (proxy mal configurado) todos comparten un cupo: el fallo
 * queda en el lado seguro, nunca abre un cupo nuevo.
 */
export function rateLimitIdentity(ip: string | undefined): string {
  const value = normalizeIp(ip);
  if (!value) return 'sin-ip';
  if (isLoopback(value)) return 'loopback';
  return isIP(value) === 6 ? ipv6Network(value) : value;
}
