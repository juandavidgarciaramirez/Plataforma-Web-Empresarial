import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WhoWeAreConceptsService } from './who-we-are-concepts.service';
import { Public } from '../../../common/decorators/public.decorator';

/** Lectura pública de los conceptos de "Quiénes somos" (sección 16 del encargo). */
@ApiTags('Contenido - Quiénes somos (público)')
@Controller('public/who-we-are-concepts')
export class PublicWhoWeAreConceptsController {
  constructor(private readonly whoWeAreConceptsService: WhoWeAreConceptsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar los conceptos activos de Quiénes somos (público)' })
  async findAll() {
    const concepts = await this.whoWeAreConceptsService.findAll();
    return concepts.filter((concept) => concept.isActive);
  }
}
