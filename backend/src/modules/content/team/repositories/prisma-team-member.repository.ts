import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../prisma/generated';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import {
  TeamMemberConnectorCurve,
  TeamMemberEntity,
  TeamMemberOrgLevel,
  TeamMemberStatus,
} from '../entities/team-member.entity';
import { TeamMemberRepository } from './team-member.repository.interface';

type TeamMemberRow = {
  id: bigint;
  name: string;
  position: string;
  bio: string | null;
  photo_url: string | null;
  photo_alt: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  profession: string | null;
  area: string | null;
  service_code: string | null;
  specialties: Prisma.JsonValue;
  certifications: Prisma.JsonValue | null;
  certifications_label: string | null;
  is_transversal: boolean;
  org_level: number | null;
  parent_id: bigint | null;
  connector_curve: string | null;
};

/** Implementación real sobre `content.team_members` (Etapa 5, extendida en Etapa 7 con los campos del Organigrama). */
@Injectable()
export class PrismaTeamMemberRepository implements TeamMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TeamMemberEntity[]> {
    const rows = await this.prisma.team_members.findMany({ orderBy: { sort_order: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<TeamMemberEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.team_members.findUnique({ where: { id: bigintId } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<TeamMemberEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMemberEntity> {
    const row = await this.prisma.team_members.create({
      data: {
        name: data.name,
        position: data.position,
        bio: data.bio,
        photo_url: data.photoUrl,
        photo_alt: data.photoAlt ?? null,
        sort_order: data.order,
        is_active: data.status !== 'INACTIVE',
        profession: data.profession,
        area: data.area,
        service_code: data.serviceCode,
        specialties: (data.specialties ?? []) as Prisma.InputJsonValue,
        certifications: (data.certifications ?? undefined) as Prisma.InputJsonValue | undefined,
        certifications_label: data.certificationsLabel,
        is_transversal: data.isTransversal ?? false,
        org_level: data.orgLevel,
        parent_id: this.toBigIntOrNull(data.parentId),
        connector_curve: data.connectorCurve,
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    data: Partial<Omit<TeamMemberEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<TeamMemberEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;

    try {
      const row = await this.prisma.team_members.update({
        where: { id: bigintId },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.position !== undefined && { position: data.position }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.photoUrl !== undefined && { photo_url: data.photoUrl }),
          ...(data.photoAlt !== undefined && { photo_alt: data.photoAlt }),
          ...(data.order !== undefined && { sort_order: data.order }),
          ...(data.status !== undefined && { is_active: data.status !== 'INACTIVE' }),
          ...(data.profession !== undefined && { profession: data.profession }),
          ...(data.area !== undefined && { area: data.area }),
          ...(data.serviceCode !== undefined && { service_code: data.serviceCode }),
          ...(data.specialties !== undefined && { specialties: data.specialties as Prisma.InputJsonValue }),
          ...(data.certifications !== undefined && {
            certifications: data.certifications as Prisma.InputJsonValue,
          }),
          ...(data.certificationsLabel !== undefined && { certifications_label: data.certificationsLabel }),
          ...(data.isTransversal !== undefined && { is_transversal: data.isTransversal }),
          ...(data.orgLevel !== undefined && { org_level: data.orgLevel }),
          ...(data.parentId !== undefined && { parent_id: this.toBigIntOrNull(data.parentId) }),
          ...(data.connectorCurve !== undefined && { connector_curve: data.connectorCurve }),
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
      await this.prisma.team_members.delete({ where: { id: bigintId } });
      return true;
    } catch {
      return false;
    }
  }

  private toEntity(row: TeamMemberRow): TeamMemberEntity {
    const entity = new TeamMemberEntity();
    entity.id = row.id.toString();
    entity.name = row.name;
    entity.position = row.position;
    entity.bio = row.bio;
    entity.photoUrl = row.photo_url;
    entity.photoAlt = row.photo_alt;
    entity.order = row.sort_order;
    entity.status = this.toStatus(row.is_active);
    entity.profession = row.profession;
    entity.area = row.area;
    entity.serviceCode = row.service_code;
    entity.specialties = this.toStringArray(row.specialties);
    entity.certifications = row.certifications === null ? null : this.toStringArray(row.certifications);
    entity.certificationsLabel = row.certifications_label;
    entity.isTransversal = row.is_transversal;
    entity.orgLevel = (row.org_level as TeamMemberOrgLevel | null) ?? null;
    entity.parentId = row.parent_id?.toString() ?? null;
    entity.connectorCurve = (row.connector_curve as TeamMemberConnectorCurve | null) ?? null;
    entity.createdAt = row.created_at;
    entity.updatedAt = row.updated_at;
    return entity;
  }

  private toStatus(isActive: boolean): TeamMemberStatus {
    return isActive ? 'ACTIVE' : 'INACTIVE';
  }

  private toStringArray(value: Prisma.JsonValue): string[] {
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }

  private toBigIntOrNull(id: string | null | undefined): bigint | null {
    if (!id) return null;
    return this.toBigInt(id);
  }
}
