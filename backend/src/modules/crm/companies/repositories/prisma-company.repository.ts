import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { CompanyEntity, CompanyStatus } from '../entities/company.entity';
import { CompanyRepository } from './company.repository.interface';

type CompanyRow = {
  id: bigint;
  legal_name: string;
  tax_id: string | null;
  industry: string | null;
  website: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

/**
 * Implementación real sobre `core.companies` (Etapa 4, jud_platform_dev).
 *
 * Adaptaciones respecto al esquema real: `country_id` es NOT NULL -> se usa
 * Colombia (`core.countries`, iso2='CO', única fila real) por defecto, ya
 * que el negocio es colombiano. `CompanyEntity.sizeSegment`, `.address` y
 * `.ownerUserId` no tienen columna equivalente en la tabla real -> se
 * exponen como `null` siempre (no se inventan datos); es una limitación
 * documentada, no un error silencioso.
 */
@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CompanyEntity[]> {
    const rows = await this.prisma.companies.findMany({ orderBy: { legal_name: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<CompanyEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.companies.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<CompanyEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyEntity> {
    const colombia = await this.prisma.countries.findFirstOrThrow({ where: { iso2: 'CO' }, select: { id: true } });

    const row = await this.prisma.companies.create({
      data: {
        country_id: colombia.id,
        legal_name: data.name,
        commercial_name: data.name,
        tax_id: data.taxId,
        industry: data.industry,
        website: data.website,
        phone: data.phone,
        is_active: data.status !== 'INACTIVE',
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<CompanyEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<CompanyEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const row = await this.prisma.companies.update({
        where: { id: bigintId },
        data: {
          ...(data.name !== undefined && { legal_name: data.name, commercial_name: data.name }),
          ...(data.taxId !== undefined && { tax_id: data.taxId }),
          ...(data.industry !== undefined && { industry: data.industry }),
          ...(data.website !== undefined && { website: data.website }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.status !== undefined && { is_active: data.status !== 'INACTIVE' }),
          updated_at: new Date(),
        },
      });
      return this.toEntity(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return false;

    try {
      // Soft delete real: la tabla no tiene `deleted_at`, así que se usa `is_active=false`
      // (borrar la fila de verdad rompería contactos/leads que la referencian).
      await this.prisma.companies.update({ where: { id: bigintId }, data: { is_active: false } });
      return true;
    } catch {
      return false;
    }
  }

  count(): Promise<number> {
    return this.prisma.companies.count();
  }

  private toEntity(row: CompanyRow): CompanyEntity {
    const entity = new CompanyEntity();
    entity.id = row.id.toString();
    entity.name = row.legal_name;
    entity.taxId = row.tax_id;
    entity.industry = row.industry;
    entity.sizeSegment = null;
    entity.website = row.website;
    entity.address = null;
    entity.phone = row.phone;
    entity.ownerUserId = null;
    entity.status = this.toStatus(row.is_active);
    entity.createdAt = row.created_at;
    entity.updatedAt = row.updated_at;
    return entity;
  }

  private toStatus(isActive: boolean): CompanyStatus {
    return isActive ? 'ACTIVE' : 'INACTIVE';
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }
}
