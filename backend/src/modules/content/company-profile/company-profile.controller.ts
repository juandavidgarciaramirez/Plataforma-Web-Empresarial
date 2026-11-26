import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyProfileService } from './company-profile.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

/** Contenido institucional singular de Home y Nosotros (secciones 14/16 del encargo). */
@ApiTags('Contenido - Home/Nosotros')
@ApiBearerAuth()
@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @Get()
  @Permissions('cms.home.read')
  @ApiOperation({ summary: 'Obtener el contenido institucional de Home y Nosotros' })
  get() {
    return this.companyProfileService.get();
  }

  @Patch()
  @Permissions('cms.home.update')
  @ApiOperation({ summary: 'Actualizar el contenido institucional de Home y Nosotros' })
  update(@Body() dto: UpdateCompanyProfileDto, @CurrentUser() user: RequestUser) {
    return this.companyProfileService.update(dto, user.email);
  }
}
