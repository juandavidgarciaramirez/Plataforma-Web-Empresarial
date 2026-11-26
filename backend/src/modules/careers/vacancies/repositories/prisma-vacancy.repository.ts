import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { VacancyEntity, VacancyModality, VacancyStatus } from '../entities/vacancy.entity';
import { VacancyRepository } from './vacancy.repository.interface';

/** Código real de la vacante placeholder (Etapa 14, migración 010) usada por postulaciones sin vacante puntual — nunca se lista como vacante real. */
export const GENERAL_TALENT_POOL_CODE = 'base-altos-potenciales';

type JobPositionRow = {
  id: bigint;
  code: string | null;
  title: string;
  department: string | null;
  location: string | null;
  work_mode: string | null;
  description: string | null;
  requirements: string | null;
  status: string;
  image_url: string | null;
  image_alt: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

/** Implementación real sobre `careers.job_positions` (Etapa 14 — existía desde antes, VacanciesModule usaba InMemoryVacancyRepository). */
@Injectable()
export class PrismaVacancyRepository implements VacancyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<VacancyEntity[]> {
    const rows = await this.prisma.job_positions.findMany({
      where: { code: { not: GENERAL_TALENT_POOL_CODE } },
      orderBy: { created_at: 'desc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<VacancyEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.job_positions.findFirst({
      where: { id: bigintId, code: { not: GENERAL_TALENT_POOL_CODE } },
    });
    return row ? this.toEntity(row) : null;
  }

  async findBySlug(slug: string): Promise<VacancyEntity | null> {
    const row = await this.prisma.job_positions.findFirst({
      where: { code: slug, NOT: { code: GENERAL_TALENT_POOL_CODE } },
    });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<VacancyEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<VacancyEntity> {
    const row = await this.prisma.job_positions.create({
      data: {
        code: data.slug,
        title: data.title,
        department: data.department,
        location: data.location,
        work_mode: data.modality,
        description: data.description,
        requirements: data.requirements,
        status: data.status,
        image_url: data.imageUrl ?? null,
        image_alt: data.imageAlt ?? null,
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<VacancyEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<VacancyEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    try {
      const row = await this.prisma.job_positions.update({
        where: { id: bigintId },
        data: {
          ...(data.slug !== undefined && { code: data.slug }),
          ...(data.title !== undefined && { title: data.title }),
          ...(data.department !== undefined && { department: data.department }),
          ...(data.location !== undefined && { location: data.location }),
          ...(data.modality !== undefined && { work_mode: data.modality }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.requirements !== undefined && { requirements: data.requirements }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.imageUrl !== undefined && { image_url: data.imageUrl }),
          ...(data.imageAlt !== undefined && { image_alt: data.imageAlt }),
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
      await this.prisma.job_positions.delete({ where: { id: bigintId } });
      return true;
    } catch {
      return false;
    }
  }

  private toEntity(row: JobPositionRow): VacancyEntity {
    const entity = new VacancyEntity();
    entity.id = row.id.toString();
    entity.slug = row.code ?? row.id.toString();
    entity.title = row.title;
    entity.department = row.department;
    entity.location = row.location;
    entity.modality = (row.work_mode as VacancyModality) ?? 'ONSITE';
    entity.description = row.description ?? '';
    entity.requirements = row.requirements;
    entity.status = row.status as VacancyStatus;
    entity.imageUrl = row.image_url;
    entity.imageAlt = row.image_alt;
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
