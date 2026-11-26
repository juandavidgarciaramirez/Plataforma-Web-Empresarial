import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('CRM - Empresas')
@ApiBearerAuth()
@Controller('crm/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @Permissions('crm.companies.read')
  @ApiOperation({ summary: 'Listar empresas' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @Permissions('crm.companies.read')
  @ApiOperation({ summary: 'Obtener una empresa por id' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Post()
  @Permissions('crm.companies.create')
  @ApiOperation({ summary: 'Crear una empresa' })
  create(@Body() dto: CreateCompanyDto, @CurrentUser() user: RequestUser) {
    return this.companiesService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('crm.companies.update')
  @ApiOperation({ summary: 'Actualizar una empresa' })
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto, @CurrentUser() user: RequestUser) {
    return this.companiesService.update(id, dto, user.email);
  }

  @Delete(':id')
  @Permissions('crm.companies.delete')
  @ApiOperation({ summary: 'Eliminar una empresa' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.companiesService.remove(id, user.email);
  }
}
