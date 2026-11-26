import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SETTING_REPOSITORY, SettingRepository } from './repositories/setting.repository.interface';
import { SettingEntity } from './entities/setting.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SettingsService {
  constructor(
    @Inject(SETTING_REPOSITORY) private readonly settingRepository: SettingRepository,
    private readonly auditService: AuditService,
  ) {}

  findAll(): Promise<SettingEntity[]> {
    return this.settingRepository.findAll();
  }

  findPublic(): Promise<SettingEntity[]> {
    return this.settingRepository.findPublic();
  }

  async update(key: string, value: string, actorEmail: string): Promise<SettingEntity> {
    const updated = await this.settingRepository.updateValue(key, value);
    if (!updated) {
      throw new NotFoundException(`No existe la configuración "${key}"`);
    }
    this.auditService.log(actorEmail, 'settings.update', `Configuración actualizada: ${key} = ${value}`);
    return updated;
  }
}
