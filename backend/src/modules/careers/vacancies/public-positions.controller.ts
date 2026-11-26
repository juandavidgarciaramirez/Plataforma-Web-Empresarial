import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { VacancyEntity, VacancyModality } from './entities/vacancy.entity';
import { Public } from '../../../common/decorators/public.decorator';
import { toPublicImage } from '../../media/media.types';

const MODALITY_LABEL: Record<VacancyModality, string> = {
  ONSITE: 'Presencial',
  REMOTE: 'Remoto',
  HYBRID: 'Híbrido',
};

/** Forma pública consumida por `/trabaja-con-nosotros` (antes servida por el segundo backend, `@/data/careers.ts` estático). */
function toPublicPosition(v: VacancyEntity) {
  return {
    slug: v.slug,
    cargo: v.title,
    area: v.department ?? '',
    ubicacion: v.location ?? '',
    modalidad: MODALITY_LABEL[v.modality],
    // `VacancyEntity` todavía no modela tipo de contrato por separado — ver docs/backend-audit.md.
    tipoContrato: '',
    fecha: v.createdAt.toISOString(),
    descripcion: v.description,
    responsabilidades: [] as string[],
    requisitos: v.requirements ? v.requirements.split('\n').map((s) => s.trim()).filter(Boolean) : [],
    queOfrecemos: [] as string[],
    imagen: v.imageUrl ? { url: v.imageUrl, alt: v.imageAlt } : null,
    galeria: (v.gallery ?? []).map(toPublicImage),
  };
}

/**
 * Listado público de vacantes (sección 23 del encargo: "Trabaja con
 * nosotros"). Lee de la misma fuente real que administra el Admin
 * (`VacanciesService`) — antes el sitio público leía de un archivo estático
 * (`src/data/careers.ts`) desconectado de cualquier backend. Solo expone
 * vacantes con `status = OPEN`.
 */
@ApiTags('Talento - Vacantes (público)')
@Controller('careers/positions')
export class PublicPositionsController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar vacantes abiertas (público)' })
  async findAll() {
    const vacancies = await this.vacanciesService.findAll();
    return vacancies.filter((v) => v.status === 'OPEN').map(toPublicPosition);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Obtener una vacante abierta por slug (público)' })
  async findOne(@Param('slug') slug: string) {
    const vacancies = await this.vacanciesService.findAll();
    const vacancy = vacancies.find((v) => v.slug === slug && v.status === 'OPEN');
    if (!vacancy) {
      throw new NotFoundException(`No existe una vacante abierta con el slug ${slug}`);
    }
    return toPublicPosition(vacancy);
  }
}
