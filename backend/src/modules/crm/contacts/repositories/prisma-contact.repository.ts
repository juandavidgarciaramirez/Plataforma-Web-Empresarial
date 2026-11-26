import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { ContactEntity } from '../entities/contact.entity';
import { ContactRepository } from './contact.repository.interface';
import { getNoCompanyPlaceholderId } from '../../common/crm-db.util';
import { splitFullName } from '../../../../common/utils/name.util';

type ContactRow = {
  id: bigint;
  company_id: bigint;
  first_name: string;
  last_name: string;
  full_name: string | null;
  job_title: string | null;
  email: string | null;
  phone: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

/**
 * Implementación real sobre `core.contacts` (Etapa 4, jud_platform_dev).
 *
 * `company_id` es NOT NULL en la tabla real; `CreateContactDto` permite
 * omitir `companyId` (contacto independiente) — en ese caso se usa la
 * empresa placeholder real "Contactos Independientes (Sin Empresa)"
 * (ver database/migrations/015_crm_catalog_bootstrap.sql) en vez de cambiar la
 * validación de la API que ya usa el Admin. `ContactEntity.ownerUserId` no
 * tiene columna equivalente -> se expone como `null` siempre.
 */
@Injectable()
export class PrismaContactRepository implements ContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ContactEntity[]> {
    const rows = await this.prisma.contacts.findMany({ orderBy: { full_name: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<ContactEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.contacts.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async findByCompanyId(companyId: string): Promise<ContactEntity[]> {
    const bigintId = this.toBigInt(companyId);
    if (bigintId === null) return [];
    const rows = await this.prisma.contacts.findMany({ where: { company_id: bigintId }, orderBy: { full_name: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async create(data: Omit<ContactEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactEntity> {
    const companyId = data.companyId ? this.toBigInt(data.companyId) : null;
    const resolvedCompanyId = companyId ?? (await getNoCompanyPlaceholderId(this.prisma));
    const { firstName, lastName } = splitFullName(data.name);

    const row = await this.prisma.contacts.create({
      data: {
        company_id: resolvedCompanyId,
        first_name: firstName,
        last_name: lastName,
        full_name: data.name,
        job_title: data.position,
        email: data.email,
        phone: data.phone,
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<ContactEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ContactEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    const nameFields =
      data.name !== undefined
        ? (() => {
            const { firstName, lastName } = splitFullName(data.name!);
            return { first_name: firstName, last_name: lastName, full_name: data.name };
          })()
        : {};

    try {
      const row = await this.prisma.contacts.update({
        where: { id: bigintId },
        data: {
          ...nameFields,
          ...(data.email !== undefined && { email: data.email }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.position !== undefined && { job_title: data.position }),
          ...(data.companyId !== undefined && data.companyId !== null && { company_id: this.toBigInt(data.companyId) ?? undefined }),
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
      // Sin `deleted_at` en la tabla real -> se usa `is_active=false` (soft delete).
      await this.prisma.contacts.update({ where: { id: bigintId }, data: { is_active: false } });
      return true;
    } catch {
      return false;
    }
  }

  count(): Promise<number> {
    return this.prisma.contacts.count();
  }

  private toEntity(row: ContactRow): ContactEntity {
    const entity = new ContactEntity();
    entity.id = row.id.toString();
    entity.name = row.full_name ?? `${row.first_name} ${row.last_name}`.trim();
    entity.email = row.email;
    entity.phone = row.phone;
    entity.position = row.job_title;
    entity.companyId = row.company_id.toString();
    entity.ownerUserId = null;
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
