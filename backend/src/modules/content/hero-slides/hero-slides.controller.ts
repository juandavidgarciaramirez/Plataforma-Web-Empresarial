import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HeroSlidesService } from './hero-slides.service';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

@ApiTags('Contenido - Hero Home')
@ApiBearerAuth()
@Controller('hero-slides')
export class HeroSlidesController {
  constructor(private readonly heroSlidesService: HeroSlidesService) {}

  @Get()
  @Permissions('cms.hero.read')
  @ApiOperation({ summary: 'Listar slides del carrusel principal de Home' })
  findAll() {
    return this.heroSlidesService.findAll();
  }

  @Get(':id')
  @Permissions('cms.hero.read')
  @ApiOperation({ summary: 'Obtener un slide por id' })
  findOne(@Param('id') id: string) {
    return this.heroSlidesService.findOne(id);
  }

  @Post()
  @Permissions('cms.hero.create')
  @ApiOperation({ summary: 'Crear un slide del carrusel de Home' })
  create(@Body() dto: CreateHeroSlideDto, @CurrentUser() user: RequestUser) {
    return this.heroSlidesService.create(dto, user.email);
  }

  @Patch(':id')
  @Permissions('cms.hero.update')
  @ApiOperation({ summary: 'Actualizar un slide del carrusel de Home' })
  update(@Param('id') id: string, @Body() dto: UpdateHeroSlideDto, @CurrentUser() user: RequestUser) {
    return this.heroSlidesService.update(id, dto, user.email);
  }

  @Delete(':id')
  @Permissions('cms.hero.delete')
  @ApiOperation({ summary: 'Eliminar un slide del carrusel de Home' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.heroSlidesService.remove(id, user.email);
  }
}
