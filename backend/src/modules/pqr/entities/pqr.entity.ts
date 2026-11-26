// Etapa 3 (2026-08-26): se agregó 'FELICITACION' — la sección 21 del
// encargo pide los 5 tipos; solo existían 4.
export const PQR_TYPES = ['PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA', 'FELICITACION'] as const;
export type PqrType = (typeof PQR_TYPES)[number];

export const PQR_STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED'] as const;
export type PqrStatus = (typeof PQR_STATUSES)[number];

export const PQR_DOCUMENT_TYPES = ['CC', 'CE', 'NIT', 'PASAPORTE', 'OTRO'] as const;
export type PqrDocumentType = (typeof PQR_DOCUMENT_TYPES)[number];

export class PqrEntity {
  id!: string;
  radicado!: string;
  type!: PqrType;
  fullName!: string;
  email!: string;
  phone!: string | null;
  /** Empresa/documento del solicitante (sección 21 del encargo) — opcionales, no todos los formularios los piden. */
  company!: string | null;
  documentType!: PqrDocumentType | null;
  documentNumber!: string | null;
  subject!: string;
  description!: string;
  /** Ruta relativa del adjunto (ver `common/utils/file-upload.util.ts`), null si no se adjuntó nada. */
  attachmentUrl!: string | null;
  status!: PqrStatus;
  response!: string | null;
  respondedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
