import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyProfileService } from './company-profile.service';
import { Public } from '../../../common/decorators/public.decorator';

/**
 * Lectura pública del contenido institucional de Home y Nosotros (secciones
 * 14/16 del encargo). Antes el sitio leía las constantes estáticas de
 * `src/data/about.ts`, desconectadas de cualquier backend. No expone datos
 * sensibles: es la misma copia de marketing/institucional que ya es pública
 * en el sitio.
 */
@ApiTags('Contenido - Home/Nosotros (público)')
@Controller('public/company-profile')
export class PublicCompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener el contenido institucional de Home y Nosotros (público)' })
  get() {
    return this.companyProfileService.get();
  }
}
