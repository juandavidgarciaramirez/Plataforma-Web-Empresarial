export class FileEntity {
  id!: string;
  originalName!: string;
  fileName!: string;
  extension!: string | null;
  mimeType!: string | null;
  sizeBytes!: string | null;
  folder!: string | null;
  storagePath!: string;
  publicUrl!: string | null;
  description!: string | null;
  isPublic!: boolean;
  /** Tipo de entidad relacionada (p. ej. "pqr", "application"), si aplica. */
  entityType!: string | null;
  entityId!: string | null;
  uploadedBy!: string | null;
  /** Dimensiones en píxeles (solo imágenes subidas desde el CMS, Etapa 15). */
  width!: number | null;
  height!: number | null;
  createdAt!: Date;
  updatedAt!: Date;
}
