import { PermissionKey } from '../permissions/permissions.constants';
import { ImageFormat } from './image-inspector';

/**
 * Reglas de las imágenes administrables (Etapa 15). Todo lo numérico es
 * configurable por variables de entorno; los valores por defecto son los que
 * documenta docs/media-y-analitica.md. El frontend obtiene estas mismas reglas
 * de `GET /media/rules` para validar antes de subir — el backend siempre
 * vuelve a validar.
 */

function envInt(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? '', 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

const FORMAT_MIME: Record<ImageFormat, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};

const FORMAT_EXTENSIONS: Record<ImageFormat, string[]> = {
  jpeg: ['jpg', 'jpeg'],
  png: ['png'],
  webp: ['webp'],
  avif: ['avif'],
};

/** Formatos aceptados (`MEDIA_ALLOWED_FORMATS`, por defecto jpeg,png,webp,avif). SVG/GIF quedan fuera a propósito. */
export function allowedFormats(): ImageFormat[] {
  const raw = (process.env.MEDIA_ALLOWED_FORMATS ?? 'jpeg,png,webp,avif')
    .split(',')
    .map((f) => f.trim().toLowerCase());
  return (Object.keys(FORMAT_MIME) as ImageFormat[]).filter((format) => raw.includes(format));
}

export interface MediaLimits {
  maxSizeBytes: number;
  maxDimension: number;
  maxGalleryImages: number;
  allowedFormats: ImageFormat[];
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}

/**
 * Tope duro que aplica Multer antes de que el archivo llegue a MediaService
 * (se lee al cargar el módulo, por eso es fijo). `MEDIA_MAX_IMAGE_MB` nunca
 * puede superarlo; por debajo de él, el exceso se informa con un mensaje claro.
 */
export const MEDIA_UPLOAD_HARD_LIMIT_BYTES = 25 * 1024 * 1024;

export function mediaLimits(): MediaLimits {
  const formats = allowedFormats();
  return {
    maxSizeBytes: Math.min(envInt('MEDIA_MAX_IMAGE_MB', 5) * 1024 * 1024, MEDIA_UPLOAD_HARD_LIMIT_BYTES),
    maxDimension: envInt('MEDIA_MAX_DIMENSION_PX', 8000),
    maxGalleryImages: envInt('MEDIA_MAX_GALLERY_IMAGES', 12),
    allowedFormats: formats,
    allowedMimeTypes: formats.map((f) => FORMAT_MIME[f]),
    allowedExtensions: formats.flatMap((f) => FORMAT_EXTENSIONS[f]),
  };
}

export interface MediaSlotRule {
  label: string;
  /** null = usa `MEDIA_MAX_GALLERY_IMAGES`. */
  max: number | null;
  recommendedWidth: number;
  recommendedHeight: number;
}

export interface MediaContextRule {
  label: string;
  /** Basta con tener uno de estos permisos para subir/asociar imágenes en esta sección. */
  permissions: PermissionKey[];
  slots: Record<string, MediaSlotRule>;
}

const cover = (w: number, h: number): MediaSlotRule => ({ label: 'Imagen principal', max: 1, recommendedWidth: w, recommendedHeight: h });
const gallery = (w: number, h: number): MediaSlotRule => ({ label: 'Imágenes adicionales', max: null, recommendedWidth: w, recommendedHeight: h });

/** Secciones del administrador con imágenes. La clave es el `entity_type` de `foundation.file_links`. */
export const MEDIA_CONTEXTS = {
  news: {
    label: 'Noticias',
    permissions: ['cms.news.create', 'cms.news.update'],
    slots: { cover: cover(1600, 900), gallery: gallery(1600, 1000) },
  },
  blog: {
    label: 'Blog',
    permissions: ['cms.blog.create', 'cms.blog.update'],
    slots: { cover: cover(1600, 900), gallery: gallery(1600, 1000) },
  },
  services: {
    label: 'Servicios',
    permissions: ['cms.services.create', 'cms.services.update'],
    slots: { cover: cover(1600, 1000), gallery: gallery(1600, 1000) },
  },
  vacancies: {
    label: 'Vacantes',
    permissions: ['jobs.vacancies.create', 'jobs.vacancies.update'],
    slots: { cover: cover(1200, 675), gallery: { ...gallery(1200, 800), max: 6 } },
  },
  team: {
    label: 'Equipo / Organigrama',
    permissions: ['cms.team.create', 'cms.team.update'],
    slots: { photo: { label: 'Fotografía', max: 1, recommendedWidth: 800, recommendedHeight: 1000 } },
  },
  careers_page: {
    label: 'Sección pública Trabaja con nosotros',
    permissions: ['jobs.vacancies.update'],
    slots: {
      hero: { label: 'Imagen de cabecera', max: 1, recommendedWidth: 1600, recommendedHeight: 1000 },
      talent: { label: 'Imagen "Talento que impulsa el cambio"', max: 1, recommendedWidth: 1600, recommendedHeight: 1000 },
      growth: { label: 'Imagen complementaria', max: 1, recommendedWidth: 1200, recommendedHeight: 675 },
    },
  },
} satisfies Record<string, MediaContextRule>;

export type MediaContext = keyof typeof MEDIA_CONTEXTS;

export function isMediaContext(value: string): value is MediaContext {
  return Object.prototype.hasOwnProperty.call(MEDIA_CONTEXTS, value);
}

export function slotRule(context: MediaContext, slot: string): MediaSlotRule | null {
  const slots: Record<string, MediaSlotRule> = MEDIA_CONTEXTS[context].slots;
  return Object.prototype.hasOwnProperty.call(slots, slot) ? slots[slot] : null;
}

export function slotMax(rule: MediaSlotRule): number {
  return rule.max ?? mediaLimits().maxGalleryImages;
}

/** La sección "Trabaja con nosotros" no es una fila de ninguna tabla: sus imágenes se enlazan a este id fijo. */
export const CAREERS_PAGE_ENTITY_ID = '1';

/** Subcarpeta de `FILE_STORAGE_PATH` y valor de `foundation.files.folder` para estas imágenes. */
export const MEDIA_FOLDER = 'media';

/** Imágenes subidas que nunca llegaron a guardarse con un contenido se eliminan pasado este plazo. */
export const UNLINKED_UPLOAD_TTL_HOURS = 24;
