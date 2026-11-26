import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { CRM_CATALOG, CrmSetupError } from '../../crm/common/crm-db.util';
import { FileEntity } from '../entities/file.entity';
import { CreateFileData, FileRepository } from './file.repository.interface';

type FileRow = {
  id: bigint;
  original_name: string;
  file_name: string;
  extension: string | null;
  mime_type: string | null;
  size_bytes: bigint | null;
  folder: string | null;
  storage_path: string;
  public_url: string | null;
  description: string | null;
  is_public: boolean | null;
  entity_type: string | null;
  entity_id: bigint | null;
  uploaded_by: bigint | null;
  width: number | null;
  height: number | null;
  created_at: Date | null;
  updated_at: Date | null;
};

/**
 * Implementación real sobre `foundation.files` (existía desde la Etapa 1,
 * movida ahí desde `core`, pero ningún módulo la usaba — PQR y Careers
 * solo guardaban la ruta como texto plano). `company_id` es NOT NULL en la
 * tabla real (diseño multi-tenant): para este proyecto de una sola empresa
 * se resuelve siempre a la compañía propia (`ownCompany` en crm-catalog.json),
 * que debe existir en `core.companies`: ninguna migración la crea, porque
 * insertarla podría duplicar una empresa real con otro nombre legal.
 */
@Injectable()
export class PrismaFileRepository implements FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { entityType?: string; entityId?: string }): Promise<FileEntity[]> {
    const rows = await this.prisma.files.findMany({
      where: {
        is_deleted: false,
        ...(filters?.entityType && { entity_type: filters.entityType }),
        ...(filters?.entityId && { entity_id: this.toBigInt(filters.entityId) ?? undefined }),
      },
      orderBy: { created_at: 'desc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<FileEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.files.findFirst({ where: { id: bigintId, is_deleted: false } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: CreateFileData): Promise<FileEntity> {
    const companyId = await this.resolveOwnCompanyId();
    const storageProviderId = await this.resolveDefaultStorageProviderId();

    const row = await this.prisma.files.create({
      data: {
        company_id: companyId,
        uploaded_by: this.toBigInt(data.uploadedBy ?? ''),
        storage_provider_id: storageProviderId,
        original_name: data.originalName,
        file_name: data.fileName,
        extension: data.extension,
        mime_type: data.mimeType,
        size_bytes: BigInt(data.sizeBytes),
        folder: data.folder,
        storage_path: data.storagePath,
        public_url: data.publicUrl ?? null,
        width: data.width ?? null,
        height: data.height ?? null,
        description: data.description ?? null,
        is_public: data.isPublic ?? false,
        entity_type: data.entityType ?? null,
        entity_id: this.toBigInt(data.entityId ?? ''),
        is_deleted: false,
      },
    });
    return this.toEntity(row);
  }

  async softDelete(id: string): Promise<boolean> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return false;
    try {
      await this.prisma.files.update({ where: { id: bigintId }, data: { is_deleted: true, updated_at: new Date() } });
      return true;
    } catch {
      return false;
    }
  }

  private async resolveOwnCompanyId(): Promise<bigint> {
    const { legalName } = CRM_CATALOG.ownCompany;
    const company = await this.prisma.companies.findFirst({
      where: { legal_name: { equals: legalName, mode: 'insensitive' } },
      select: { id: true },
    });
    if (!company) {
      throw new CrmSetupError(
        `No existe la empresa propia "${legalName}" en core.companies y no se puede registrar el archivo`,
        'crearla o ajustar ownCompany en crm-catalog.json',
      );
    }
    return company.id;
  }

  private async resolveDefaultStorageProviderId(): Promise<bigint | null> {
    const provider = await this.prisma.storage_providers.findFirst({
      where: { is_active: true },
      orderBy: { is_default: 'desc' },
      select: { id: true },
    });
    return provider?.id ?? null;
  }

  private toEntity(row: FileRow): FileEntity {
    const entity = new FileEntity();
    entity.id = row.id.toString();
    entity.originalName = row.original_name;
    entity.fileName = row.file_name;
    entity.extension = row.extension;
    entity.mimeType = row.mime_type;
    entity.sizeBytes = row.size_bytes?.toString() ?? null;
    entity.folder = row.folder;
    entity.storagePath = row.storage_path;
    entity.publicUrl = row.public_url;
    entity.description = row.description;
    entity.isPublic = row.is_public ?? false;
    entity.entityType = row.entity_type;
    entity.entityId = row.entity_id?.toString() ?? null;
    entity.uploadedBy = row.uploaded_by?.toString() ?? null;
    entity.width = row.width;
    entity.height = row.height;
    entity.createdAt = row.created_at ?? new Date(0);
    entity.updatedAt = row.updated_at ?? new Date(0);
    return entity;
  }

  private toBigInt(id: string): bigint | null {
    try {
      return id ? BigInt(id) : null;
    } catch {
      return null;
    }
  }
}
