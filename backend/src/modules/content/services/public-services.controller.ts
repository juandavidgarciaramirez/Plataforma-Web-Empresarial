import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServicesContentService } from './services-content.service';
import { ServiceEntity } from './entities/service.entity';
import { Public } from '../../../common/decorators/public.decorator';
import { toPublicImage } from '../../media/media.types';

/**
 * Lectura pública de las imágenes administrables de cada línea de servicio
 * (Etapa 15). Las páginas `/servicios/<slug>` siguen siendo estáticas en el
 * frontend; solo consultan aquí la imagen principal y la galería para
 * reemplazar su imagen por defecto cuando el administrador cargó una.
 */
function toPublicService(service: ServiceEntity) {
  return {
    slug: service.slug,
    name: service.name,
    shortDescription: service.shortDescription,
    imageUrl: service.imageUrl,
    imageAlt: service.imageAlt,
    gallery: (service.gallery ?? []).map(toPublicImage),
  };
}

@ApiTags('Contenido - Servicios (público)')
@Controller('public/services')
export class PublicServicesController {
  constructor(private readonly servicesService: ServicesContentService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar servicios publicados con sus imágenes (público)' })
  async findAll() {
    const services = await this.servicesService.findAll();
    return services.filter((service) => service.status === 'PUBLISHED').map(toPublicService);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Obtener un servicio publicado por slug (público)' })
  async findBySlug(@Param('slug') slug: string) {
    return toPublicService(await this.servicesService.findPublishedBySlug(slug));
  }
}
