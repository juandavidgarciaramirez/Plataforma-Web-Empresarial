import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyValuesService } from './company-values.service';
import { CreateCompanyValueDto } from './dto/create-company-value.dto';
import { UpdateCompanyValueDto } from './dto/update-company-value.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('Contenido - Valores')
@ApiBearerAuth()
@Controller('company-values')
export class CompanyValuesController {
  constructor(private readonly companyValuesService: CompanyValuesService) {}

  @Get()
  @Permissions('cms.values.read')
  @ApiOperation({ summary: 'Listar valores corporativos' })
  findAll() {
    return this.companyValuesService.findAll();
  }

  @Get(':id')
  @Permissions('cms.values.read')
  @ApiOperation({ summary: 'Obtener un valor corporativo por id' })
  findOne(@Param('id') id: string) {
    return this.companyValuesService.findOne(id);
  }

  @Post()
  @Permissions('cms.values.create')
  @ApiOperation({ summary: 'Crear un valor corporativo' })
  create(@Body() dto: CreateCompanyValueDto, @CurrentUser() user: RequestUser) {
    return this.companyValuesService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('cms.values.update')
  @ApiOperation({ summary: 'Actualizar un valor corporativo' })
  update(@Param('id') id: string, @Body() dto: UpdateCompanyValueDto, @CurrentUser() user: RequestUser) {
    return this.companyValuesService.update(id, dto, user.email);
  }

  @Delete(':id')
  @Permissions('cms.values.delete')
  @ApiOperation({ summary: 'Eliminar un valor corporativo' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.companyValuesService.remove(id, user.email);
  }
}
