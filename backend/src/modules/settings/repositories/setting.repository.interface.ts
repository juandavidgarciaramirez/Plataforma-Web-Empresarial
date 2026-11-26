import { SettingEntity } from '../entities/setting.entity';

export interface SettingRepository {
  findAll(): Promise<SettingEntity[]>;
  findPublic(): Promise<SettingEntity[]>;
  findByKey(key: string): Promise<SettingEntity | null>;
  updateValue(key: string, value: string): Promise<SettingEntity | null>;
}

export const SETTING_REPOSITORY = 'SETTING_REPOSITORY';
