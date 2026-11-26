import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Request } from 'express';

/** Firma exacta que espera `MulterOptions.fileFilter` en @nestjs/platform-express. */
type MulterFileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

/**
 * Almacenamiento local de archivos (sección 42/5 del encargo: `FileService`,
 * `FILE_STORAGE_PROVIDER`/`FILE_STORAGE_PATH`). Real, no simulado: los
 * archivos se escriben en disco. `FILE_STORAGE_PATH` es la raíz (por
 * defecto `./uploads`, relativa al proceso del backend); cada llamador pasa
 * su propia subcarpeta (`pqr`, `careers/cv`).
 *
 * Es un `FileService` mínimo a propósito — solo cubre lo que PQR/Careers
 * necesitan hoy (subir + nombrar de forma segura). Un `FileService` completo
 * (metadata en BD, `foundation.files`, descarga controlada) queda pendiente
 * como módulo propio (ver docs/backend-audit.md, sección "Módulos ausentes").
 */
export interface FileRule {
  allowedExtensions: string[];
  allowedMimeTypes: string[];
  maxSizeBytes: number;
}

export const PQR_ATTACHMENT_RULE: FileRule = {
  allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
  allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  maxSizeBytes: 5 * 1024 * 1024,
};

export const RESUME_RULE: FileRule = {
  allowedExtensions: ['pdf', 'doc', 'docx'],
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  maxSizeBytes: 5 * 1024 * 1024,
};

/** Regla genérica del módulo Files (admin) — misma lista que `foundation.system_settings` (files.allowed_extensions / files.max_size_mb). */
export const GENERIC_FILE_RULE: FileRule = {
  allowedExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'jpg', 'jpeg', 'png', 'webp'],
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/webp',
  ],
  maxSizeBytes: 25 * 1024 * 1024,
};

function storageRoot(): string {
  return process.env.FILE_STORAGE_PATH || './uploads';
}

/** Config de Multer (`diskStorage`) para una subcarpeta dada, con nombre de archivo aleatorio (no confiar en el nombre original). */
export function diskStorageFor(subfolder: string) {
  const dir = join(storageRoot(), subfolder);
  return diskStorage({
    destination: (_req, _file, cb) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${randomUUID()}${ext}`);
    },
  });
}

/** `fileFilter` de Multer: valida extensión + MIME contra una `FileRule` (el tamaño lo valida Multer con `limits.fileSize`). */
export function fileFilterFor(rule: FileRule) {
  return (_req: Request, file: Express.Multer.File, cb: MulterFileFilterCallback) => {
    const ext = extname(file.originalname).toLowerCase().replace('.', '');

    if (!rule.allowedExtensions.includes(ext)) {
      return cb(
        new BadRequestException(
          `Extensión de archivo no permitida (.${ext || '?'}). Formatos aceptados: ${rule.allowedExtensions.join(', ')}.`,
        ),
        false,
      );
    }

    if (file.mimetype && !rule.allowedMimeTypes.includes(file.mimetype)) {
      return cb(new BadRequestException('El tipo de archivo no coincide con los formatos permitidos.'), false);
    }

    cb(null, true);
  };
}

/** Ruta relativa (subfolder/filename) que se guarda en el registro — nunca la ruta absoluta del disco. */
export function relativeUploadPath(subfolder: string, filename: string): string {
  return `${subfolder}/${filename}`;
}
