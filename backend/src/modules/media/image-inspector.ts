/**
 * Identifica el formato REAL de una imagen a partir de sus bytes (firma /
 * "magic numbers") y lee sus dimensiones de la cabecera — nunca se confía en
 * la extensión ni en el `Content-Type` que declara el navegador. Sin
 * dependencias nuevas: JPEG, PNG, WebP y AVIF se reconocen por su estructura.
 *
 * Devuelve `null` si los bytes no corresponden a ninguno de esos formatos o
 * si la cabecera está incompleta (archivo truncado o manipulado).
 */
export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

export interface InspectedImage {
  format: ImageFormat;
  mimeType: string;
  extension: string;
  width: number;
  height: number;
}

const FORMAT_INFO: Record<ImageFormat, { mimeType: string; extension: string }> = {
  jpeg: { mimeType: 'image/jpeg', extension: 'jpg' },
  png: { mimeType: 'image/png', extension: 'png' },
  webp: { mimeType: 'image/webp', extension: 'webp' },
  avif: { mimeType: 'image/avif', extension: 'avif' },
};

export function inspectImage(buffer: Buffer): InspectedImage | null {
  const parsed = readPng(buffer) ?? readJpeg(buffer) ?? readWebp(buffer) ?? readAvif(buffer);
  if (!parsed || parsed.width <= 0 || parsed.height <= 0) return null;
  return { ...parsed, ...FORMAT_INFO[parsed.format] };
}

type Parsed = { format: ImageFormat; width: number; height: number };

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function readPng(buf: Buffer): Parsed | null {
  if (buf.length < 24 || !buf.subarray(0, 8).equals(PNG_SIGNATURE)) return null;
  // El primer chunk de un PNG válido es siempre IHDR (ancho y alto big-endian).
  if (buf.toString('ascii', 12, 16) !== 'IHDR') return null;
  return { format: 'png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function readJpeg(buf: Buffer): Parsed | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) return null;
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) return null;
    const marker = buf[offset + 1];
    // Relleno entre segmentos.
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    // Marcadores sin longitud (RSTn, TEM).
    if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      offset += 2;
      continue;
    }
    const length = buf.readUInt16BE(offset + 2);
    if (length < 2) return null;
    // SOF0..SOF15 salvo DHT (C4), JPG (C8) y DAC (CC): contienen alto y ancho.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { format: 'jpeg', height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

function readWebp(buf: Buffer): Parsed | null {
  if (buf.length < 30 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') {
    // Frame clave con su código de inicio 9D 01 2A.
    if (buf[23] !== 0x9d || buf[24] !== 0x01 || buf[25] !== 0x2a) return null;
    return { format: 'webp', width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === 'VP8L') {
    if (buf[20] !== 0x2f) return null;
    const bits = buf.readUInt32LE(21);
    return { format: 'webp', width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') {
    return { format: 'webp', width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  }
  return null;
}

function readAvif(buf: Buffer): Parsed | null {
  if (buf.length < 16 || buf.toString('ascii', 4, 8) !== 'ftyp') return null;
  const boxSize = buf.readUInt32BE(0);
  if (boxSize < 16 || boxSize > buf.length) return null;
  // Marca principal + marcas compatibles del box `ftyp`.
  const brands: string[] = [buf.toString('ascii', 8, 12)];
  for (let offset = 16; offset + 4 <= boxSize; offset += 4) brands.push(buf.toString('ascii', offset, offset + 4));
  if (!brands.includes('avif') && !brands.includes('avis')) return null;
  // Propiedad `ispe` (Image Spatial Extents): tamaño(4) 'ispe'(4) versión+flags(4) ancho(4) alto(4).
  const limit = Math.min(buf.length, 256 * 1024);
  const ispe = buf.indexOf('ispe', 0, 'ascii');
  if (ispe < 4 || ispe + 16 > limit) return null;
  return { format: 'avif', width: buf.readUInt32BE(ispe + 8), height: buf.readUInt32BE(ispe + 12) };
}
