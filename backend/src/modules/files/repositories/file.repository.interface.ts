import { FileEntity } from '../entities/file.entity';

export interface CreateFileData {
  originalName: string;
  fileName: string;
  extension: string | null;
  mimeType: string | null;
  sizeBytes: number;
  folder: string | null;
  storagePath: string;
  description?: string | null;
  isPublic?: boolean;
  entityType?: string | null;
  entityId?: string | null;
  uploadedBy: string | null;
  /** URL pública absoluta (solo archivos servidos al sitio, p. ej. imágenes del CMS). */
  publicUrl?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface FileRepository {
  findAll(filters?: { entityType?: string; entityId?: string }): Promise<FileEntity[]>;
  findById(id: string): Promise<FileEntity | null>;
  create(data: CreateFileData): Promise<FileEntity>;
  /** Borrado lógico (is_deleted = true) — nunca se elimina la fila ni el archivo físico automáticamente. */
  softDelete(id: string): Promise<boolean>;
}

export const FILE_REPOSITORY = 'FILE_REPOSITORY';
