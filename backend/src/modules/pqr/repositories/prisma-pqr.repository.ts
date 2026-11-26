import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { PqrEntity, PqrStatus } from '../entities/pqr.entity';
import { PqrRepository } from './pqr.repository.interface';
import { findOrCreateCompanyByName, missingPlatformCatalogError } from '../../crm/common/crm-db.util';

type RequestRow = {
  id: bigint;
  code: string;
  requester_name: string;
  requester_email: string | null;
  requester_phone: string | null;
  subject: string;
  description: string;
  resolution: string | null;
  responded_at: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  document_type: string | null;
  document_number: string | null;
  company_id: bigint | null;
  request_types: { code: string };
  request_statuses: { code: string };
  companies: { legal_name: string } | null;
  request_attachments: { files: { id: bigint } | null }[];
};

const REQUEST_INCLUDE = {
  request_types: { select: { code: true } },
  request_statuses: { select: { code: true } },
  companies: { select: { legal_name: true } },
  request_attachments: { include: { files: { select: { id: true } } }, take: 1 },
} as const;

/** DB (real, 8 estados) <-> App (3 estados, contrato ya usado por el admin/sitio público). */
const APP_TO_DB_STATUS: Record<PqrStatus, string> = {
  OPEN: 'RECEIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
};

function dbToAppStatus(code: string): PqrStatus {
  if (code === 'RECEIVED') return 'OPEN';
  if (code === 'CLOSED' || code === 'REJECTED') return 'CLOSED';
  return 'IN_PROGRESS';
}

/** Prioridad fija — la app todavía no modela prioridad; MEDIA es el valor operativo por defecto del catálogo real. */
const DEFAULT_PRIORITY_CODE = 'MEDIUM';

let dailyCounter = 0;
let counterDay = '';

/** `PQR-YYYYMMDD-####`, correlativo por día. */
function nextCode(): string {
  const now = new Date();
  const day = now.toISOString().slice(0, 10).replace(/-/g, '');
  if (day !== counterDay) {
    counterDay = day;
    dailyCounter = 0;
  }
  dailyCounter += 1;
  return `PQR-${day}-${String(dailyCounter).padStart(4, '0')}`;
}

/**
 * Implementación real sobre `pqr.requests` (Etapa 14 — existía desde antes,
 * pero PqrModule usaba `InMemoryPqrRepository`, hallazgo de la Etapa 13).
 * `type_id`/`status_id`/`priority_id` resuelven contra los catálogos reales
 * ya sembrados (`pqr.request_types/statuses/priorities`). El adjunto se
 * enlaza vía `pqr.request_attachments` -> `foundation.files` (Etapa 11/13),
 * no como texto plano.
 */
@Injectable()
export class PrismaPqrRepository implements PqrRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PqrEntity[]> {
    const rows = await this.prisma.requests.findMany({ include: REQUEST_INCLUDE, orderBy: { created_at: 'desc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<PqrEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.requests.findUnique({ where: { id: bigintId }, include: REQUEST_INCLUDE });
    return row ? this.toEntity(row) : null;
  }

  async findByRadicado(radicado: string): Promise<PqrEntity | null> {
    const row = await this.prisma.requests.findUnique({ where: { code: radicado }, include: REQUEST_INCLUDE });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<PqrEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PqrEntity> {
    const [typeId, statusId, priorityId, companyId] = await Promise.all([
      this.resolveTypeId(data.type),
      this.resolveStatusId(APP_TO_DB_STATUS[data.status]),
      this.resolvePriorityId(),
      data.company ? findOrCreateCompanyByName(this.prisma, data.company) : Promise.resolve(null),
    ]);

    const row = await this.prisma.requests.create({
      data: {
        code: nextCode(),
        type_id: typeId,
        status_id: statusId,
        priority_id: priorityId,
        company_id: companyId,
        requester_name: data.fullName,
        requester_email: data.email,
        requester_phone: data.phone,
        subject: data.subject,
        description: data.description,
        source: 'WEBSITE_FORM',
        document_type: data.documentType,
        document_number: data.documentNumber,
        resolution: data.response,
        responded_at: data.respondedAt,
      },
      include: REQUEST_INCLUDE,
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<PqrEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<PqrEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const statusId = data.status !== undefined ? await this.resolveStatusId(APP_TO_DB_STATUS[data.status]) : undefined;
      const row = await this.prisma.requests.update({
        where: { id: bigintId },
        data: {
          ...(statusId !== undefined && { status_id: statusId }),
          ...(data.response !== undefined && { resolution: data.response }),
          ...(data.respondedAt !== undefined && { responded_at: data.respondedAt }),
          updated_at: new Date(),
        },
        include: REQUEST_INCLUDE,
      });
      return this.toEntity(row);
    } catch {
      return null;
    }
  }

  async countOpen(): Promise<number> {
    return this.prisma.requests.count({ where: { request_statuses: { is_closed: false } } });
  }

  /** Enlaza un archivo ya registrado en `foundation.files` con una PQR (Etapa 13/14). */
  async linkAttachment(requestId: string, fileId: string): Promise<void> {
    const bigintRequestId = this.toBigInt(requestId);
    const bigintFileId = this.toBigInt(fileId);
    if (bigintRequestId === null || bigintFileId === null) return;
    await this.prisma.request_attachments.create({
      data: { request_id: bigintRequestId, file_id: bigintFileId },
    });
  }

  private async resolveTypeId(code: string): Promise<bigint> {
    const row = await this.prisma.request_types.findFirst({ where: { code }, select: { id: true } });
    if (!row) throw missingPlatformCatalogError(`No existe el tipo de PQR "${code}" en pqr.request_types`);
    return row.id;
  }

  private async resolveStatusId(code: string): Promise<bigint> {
    const row = await this.prisma.request_statuses.findFirst({ where: { code }, select: { id: true } });
    if (!row) throw missingPlatformCatalogError(`No existe el estado de PQR "${code}" en pqr.request_statuses`);
    return row.id;
  }

  private async resolvePriorityId(): Promise<bigint> {
    const row = await this.prisma.request_priorities.findFirst({
      where: { code: DEFAULT_PRIORITY_CODE },
      select: { id: true },
    });
    if (!row) throw missingPlatformCatalogError(`No existe la prioridad "${DEFAULT_PRIORITY_CODE}" en pqr.request_priorities`);
    return row.id;
  }

  private toEntity(row: RequestRow): PqrEntity {
    const entity = new PqrEntity();
    entity.id = row.id.toString();
    entity.radicado = row.code;
    entity.type = row.request_types.code as PqrEntity['type'];
    entity.fullName = row.requester_name;
    entity.email = row.requester_email ?? '';
    entity.phone = row.requester_phone;
    entity.company = row.companies?.legal_name ?? null;
    entity.documentType = row.document_type as PqrEntity['documentType'];
    entity.documentNumber = row.document_number;
    entity.subject = row.subject;
    entity.description = row.description;
    const linkedFileId = row.request_attachments[0]?.files?.id;
    entity.attachmentUrl = linkedFileId ? `/files/${linkedFileId}/download` : null;
    entity.status = dbToAppStatus(row.request_statuses.code);
    entity.response = row.resolution;
    entity.respondedAt = row.responded_at;
    entity.createdAt = row.created_at ?? new Date(0);
    entity.updatedAt = row.updated_at ?? new Date(0);
    return entity;
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }
}
