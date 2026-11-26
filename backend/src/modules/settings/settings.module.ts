import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SETTING_REPOSITORY } from './repositories/setting.repository.interface';
import { PrismaSettingRepository } from './repositories/prisma-setting.repository';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, { provide: SETTING_REPOSITORY, useClass: PrismaSettingRepository }],
  exports: [SettingsService],
})
export class SettingsModule {}
