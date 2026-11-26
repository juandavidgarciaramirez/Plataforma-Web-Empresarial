import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces/authenticated-request.interface';
import { Public } from '../../common/decorators/public.decorator';

/** Configuración real sobre `foundation.system_settings` (existía desde antes, ningún módulo la usaba). */
@ApiTags('Configuración')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiBearerAuth()
  @Permissions('foundation.settings.read')
  @ApiOperation({ summary: 'Listar toda la configuración del sistema' })
  findAll() {
    return this.settingsService.findAll();
  }

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Listar la configuración marcada como pública (sin autenticación)' })
  findPublic() {
    return this.settingsService.findPublic();
  }

  @Patch(':key')
  @ApiBearerAuth()
  @Permissions('foundation.settings.update')
  @ApiOperation({ summary: 'Actualizar el valor de una configuración' })
  update(@Param('key') key: string, @Body() dto: UpdateSettingDto, @CurrentUser() user: RequestUser) {
    return this.settingsService.update(key, dto.value, user.email);
  }
}
