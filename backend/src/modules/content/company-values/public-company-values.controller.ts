import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyValuesService } from './company-values.service';
import { Public } from '../../../common/decorators/public.decorator';

/** Lectura pública de los valores corporativos (sección 16 del encargo). */
@ApiTags('Contenido - Valores (público)')
@Controller('public/company-values')
export class PublicCompanyValuesController {
  constructor(private readonly companyValuesService: CompanyValuesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar los valores corporativos activos (público)' })
  async findAll() {
    const values = await this.companyValuesService.findAll();
    return values.filter((value) => value.isActive);
  }
}
