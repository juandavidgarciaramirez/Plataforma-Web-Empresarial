import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HeroSlidesService } from './hero-slides.service';
import { Public } from '../../../common/decorators/public.decorator';

/**
 * Lectura pública del carrusel de Home (sección 14 del encargo). Antes el
 * sitio leía el arreglo estático `src/data/hero.ts`, desconectado de
 * cualquier backend.
 */
@ApiTags('Contenido - Hero Home (público)')
@Controller('public/hero-slides')
export class PublicHeroSlidesController {
  constructor(private readonly heroSlidesService: HeroSlidesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar los slides activos del carrusel de Home (público)' })
  async findAll() {
    const slides = await this.heroSlidesService.findAll();
    return slides.filter((slide) => slide.isActive);
  }
}
