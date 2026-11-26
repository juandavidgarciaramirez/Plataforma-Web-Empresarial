import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { Public } from '../../../common/decorators/public.decorator';
import { toPublicImage } from '../../media/media.types';
import { NewsEntity } from './entities/news.entity';

/** Sin metadatos internos de las imágenes (nombre original, id de archivo). */
function toPublicNews({ coverImageFileId: _fileId, gallery, ...news }: NewsEntity) {
  return { ...news, gallery: (gallery ?? []).map(toPublicImage) };
}

/** Lectura pública de Noticias. Antes el sitio leía `src/data/news.ts` estático. */
@ApiTags('Contenido - Noticias (público)')
@Controller('public/news')
export class PublicNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar noticias publicadas (público)' })
  async findAll() {
    const news = await this.newsService.findAll();
    return news.filter((n) => n.status === 'PUBLISHED').map(toPublicNews);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Obtener una noticia publicada por slug (público)' })
  async findBySlug(@Param('slug') slug: string) {
    const news = await this.newsService.findAll();
    const item = news.find((n) => n.slug === slug && n.status === 'PUBLISHED');
    if (!item) throw new NotFoundException(`No existe una noticia publicada con el slug ${slug}`);
    return toPublicNews(item);
  }
}
