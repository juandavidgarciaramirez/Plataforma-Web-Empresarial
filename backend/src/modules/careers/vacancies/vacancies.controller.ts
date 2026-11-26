import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('Talento - Vacantes')
@ApiBearerAuth()
@Controller('careers/vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  @Permissions('jobs.vacancies.read')
  @ApiOperation({ summary: 'Listar vacantes' })
  findAll() {
    return this.vacanciesService.findAll();
  }

  @Get(':id')
  @Permissions('jobs.vacancies.read')
  @ApiOperation({ summary: 'Obtener una vacante por id' })
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Post()
  @Permissions('jobs.vacancies.create')
  @ApiOperation({ summary: 'Crear una vacante' })
  create(@Body() dto: CreateVacancyDto, @CurrentUser() user: RequestUser) {
    return this.vacanciesService.create(dto, user);
  }

  @Patch(':id')
  @Permissions('jobs.vacancies.update')
  @ApiOperation({ summary: 'Actualizar una vacante' })
  update(@Param('id') id: string, @Body() dto: UpdateVacancyDto, @CurrentUser() user: RequestUser) {
    return this.vacanciesService.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions('jobs.vacancies.delete')
  @ApiOperation({ summary: 'Eliminar una vacante' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.vacanciesService.remove(id, user);
  }
}
