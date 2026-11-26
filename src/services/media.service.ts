import { api } from "@/lib/api/axios";

/** Secciones del administrador con imágenes (mismas claves que `MEDIA_CONTEXTS` del backend). */
export type MediaContext = "news" | "blog" | "services" | "vacancies" | "team" | "careers_page";

/** Imagen asociada a un contenido, tal como la devuelve el backend al administrador. */
export interface MediaImage {
  fileId: string;
  url: string;
  alt: string | null;
  originalName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
}

export interface UploadedImage extends MediaImage {
  warnings: string[];
}

/** Referencia que se envía al guardar un contenido. */
export interface MediaRef {
  fileId: string;
  alt?: string;
}

export interface MediaSlotRule {
  label: string;
  max: number;
  recommendedWidth: number;
  recommendedHeight: number;
}

export interface MediaRules {
  provider: string;
  uploadsEnabled: boolean;
  unavailableReason: string | null;
  maxSizeBytes: number;
  maxDimension: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  contexts: Record<MediaContext, { label: string; permissions: string[]; slots: Record<string, MediaSlotRule> }>;
}

export type CareersPageSlot = "hero" | "talent" | "growth";
export type CareersPageImages = Record<CareersPageSlot, MediaImage | null>;

/** Consume `/api/v1/media/**` (backend NestJS, Etapa 15 — registro central `foundation.files`). */
export const mediaService = {
  getRules: () => api.get<{ data: MediaRules }>("/media/rules").then((res) => res.data.data),

  uploadImage: (file: File, context: MediaContext, slot: string, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("context", context);
    formData.append("slot", slot);
    return api
      .post<{ data: UploadedImage }>("/media/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        // Imágenes grandes en conexiones lentas: más margen que el timeout general.
        timeout: 120_000,
        onUploadProgress: (event) => {
          if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
        },
      })
      .then((res) => res.data.data);
  },

  getCareersPage: () => api.get<{ data: CareersPageImages }>("/media/careers-page").then((res) => res.data.data),

  updateCareersPage: (data: Partial<Record<CareersPageSlot, MediaRef | null>>) =>
    api.put<{ data: CareersPageImages }>("/media/careers-page", data).then((res) => res.data.data),
};

/** Valor de un campo de imagen en un formulario del administrador. */
export interface ImageFieldValue {
  /** null = imagen existente sin archivo propio (p. ej. ruta estática `/images/...`). */
  fileId: string | null;
  url: string;
  alt: string;
  originalName?: string;
  sizeBytes?: number | null;
  width?: number | null;
  height?: number | null;
}

export function toImageField(image: MediaImage): ImageFieldValue {
  return {
    fileId: image.fileId,
    url: image.url,
    alt: image.alt ?? "",
    originalName: image.originalName,
    sizeBytes: image.sizeBytes,
    width: image.width,
    height: image.height,
  };
}

/** Imagen principal existente de un contenido (con o sin archivo propio). */
export function primaryImageField(url: string | null | undefined, alt: string | null | undefined, fileId?: string | null): ImageFieldValue | null {
  return url ? { fileId: fileId ?? null, url, alt: alt ?? "" } : null;
}

/**
 * Campos de imagen principal a enviar al backend comparando con el valor
 * original: solo se manda el id si cambió la imagen (subida nueva o quitada),
 * de modo que una imagen estática existente nunca se pierde al editar.
 */
export function primaryImagePayload(original: ImageFieldValue | null, current: ImageFieldValue | null) {
  const changed = (original?.fileId ?? original?.url ?? null) !== (current?.fileId ?? current?.url ?? null);
  const alt = current?.alt.trim() || null;
  if (!changed) return { fileId: undefined, alt: current ? alt : undefined };
  return { fileId: current?.fileId ?? null, alt };
}

export function galleryPayload(images: ImageFieldValue[]): MediaRef[] {
  return images.filter((image) => image.fileId).map((image) => ({ fileId: image.fileId!, alt: image.alt.trim() || undefined }));
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
