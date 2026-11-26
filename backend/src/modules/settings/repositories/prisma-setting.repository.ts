import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { SettingEntity } from '../entities/setting.entity';
import { SettingRepository } from './setting.repository.interface';

type SettingRow = {
  id: bigint;
  setting_key: string;
  setting_value: string | null;
  description: string | null;
  data_type: string | null;
  is_public: boolean | null;
  updated_at: Date | null;
};

/** Implementación real sobre `foundation.system_settings` (existía desde antes de este módulo, con 5 filas reales ya sembradas). */
@Injectable()
export class PrismaSettingRepository implements SettingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SettingEntity[]> {
    const rows = await this.prisma.system_settings.findMany({ orderBy: { setting_key: 'asc' } });
    return rows.map((row) => this.toEntity(row));
  }

  async findPublic(): Promise<SettingEntity[]> {
    const rows = await this.prisma.system_settings.findMany({
      where: { is_public: true },
      orderBy: { setting_key: 'asc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findByKey(key: string): Promise<SettingEntity | null> {
    const row = await this.prisma.system_settings.findFirst({ where: { setting_key: key } });
    return row ? this.toEntity(row) : null;
  }

  async updateValue(key: string, value: string): Promise<SettingEntity | null> {
    try {
      const row = await this.prisma.system_settings.update({
        where: { setting_key: key },
        data: { setting_value: value, updated_at: new Date() },
      });
      return this.toEntity(row);
    } catch {
      return null;
    }
  }

  private toEntity(row: SettingRow): SettingEntity {
    const entity = new SettingEntity();
    entity.id = row.id.toString();
    entity.key = row.setting_key;
    entity.value = row.setting_value;
    entity.description = row.description;
    entity.dataType = row.data_type;
    entity.isPublic = row.is_public ?? false;
    entity.updatedAt = row.updated_at ?? new Date(0);
    return entity;
  }
}
