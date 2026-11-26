import { Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { MEDIA_FOLDER } from './media.config';

/**
 * Abstracción del almacenamiento de imágenes públicas. Hoy existe una sola
 * implementación real — disco local (`FILE_STORAGE_PROVIDER=local`, la misma
 * raíz `FILE_STORAGE_PATH` que ya usan PQR y Careers) servida por el propio
 * backend en `/{API_PREFIX}/media/public/*` (ver main.ts).
 *
 * Un proveedor externo (S3, Cloudinary, etc.) se agrega implementando esta
 * interfaz; mientras no exista, configurar otro proveedor deja la carga
 * DESHABILITADA con un error explícito — nunca se simula una carga exitosa.
 */
export interface ImageStorage {
  readonly provider: string;
  /** `null` si está listo; si no, el motivo (se devuelve al administrador como 503). */
  readonly unavailableReason: string | null;
  save(key: string, data: Buffer): Promise<void>;
  remove(key: string): Promise<void>;
  publicUrl(key: string): string;
}

export const IMAGE_STORAGE = 'IMAGE_STORAGE';

/** Raíz de almacenamiento de archivos — mismo criterio que `common/utils/file-upload.util.ts`. */
export function storageRoot(): string {
  return process.env.FILE_STORAGE_PATH || './uploads';
}

/** Carpeta física de las imágenes públicas (también la usa main.ts para servirlas). */
export function mediaDirectory(): string {
  return resolve(storageRoot(), MEDIA_FOLDER);
}

function trimSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

/**
 * URL pública base de las imágenes. En producción es obligatoria
 * (`MEDIA_PUBLIC_BASE_URL`, p. ej. https://api.capitalconsulting.com.co/api/v1/media/public):
 * el backend no puede deducir de forma confiable su propio dominio público
 * detrás del proxy del hosting. En desarrollo se deriva de PORT/API_PREFIX.
 */
function publicBaseUrl(): string | null {
  const configured = process.env.MEDIA_PUBLIC_BASE_URL?.trim();
  if (configured) return trimSlashes(configured);
  if (process.env.NODE_ENV === 'production') return null;
  const port = process.env.PORT || '3001';
  const prefix = (process.env.API_PREFIX || 'api/v1').replace(/^\/+|\/+$/g, '');
  return `http://localhost:${port}/${prefix}/media/public`;
}

class LocalImageStorage implements ImageStorage {
  readonly provider = 'local';
  readonly unavailableReason: string | null;
  private readonly baseUrl: string | null;

  constructor() {
    this.baseUrl = publicBaseUrl();
    this.unavailableReason = this.baseUrl
      ? null
      : 'La carga de imágenes no está configurada: falta la variable MEDIA_PUBLIC_BASE_URL en el backend.';
  }

  async save(key: string, data: Buffer): Promise<void> {
    const dir = mediaDirectory();
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });
    await writeFile(join(dir, key), data, { flag: 'wx' });
  }

  async remove(key: string): Promise<void> {
    await unlink(join(mediaDirectory(), key)).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }

  publicUrl(key: string): string {
    return `${this.baseUrl}/${encodeURIComponent(key)}`;
  }
}

class UnsupportedImageStorage implements ImageStorage {
  readonly unavailableReason: string;

  constructor(readonly provider: string) {
    this.unavailableReason =
      `El proveedor de almacenamiento "${provider}" (FILE_STORAGE_PROVIDER) no está implementado. ` +
      'Use "local" o implemente el proveedor antes de habilitar la carga de imágenes.';
  }

  save(): Promise<void> {
    return Promise.reject(new Error(this.unavailableReason));
  }

  remove(): Promise<void> {
    return Promise.reject(new Error(this.unavailableReason));
  }

  publicUrl(): string {
    throw new Error(this.unavailableReason);
  }
}

export function createImageStorage(): ImageStorage {
  const provider = (process.env.FILE_STORAGE_PROVIDER || 'local').trim().toLowerCase();
  const storage = provider === 'local' ? new LocalImageStorage() : new UnsupportedImageStorage(provider);
  if (storage.unavailableReason) new Logger('ImageStorage').warn(storage.unavailableReason);
  return storage;
}
