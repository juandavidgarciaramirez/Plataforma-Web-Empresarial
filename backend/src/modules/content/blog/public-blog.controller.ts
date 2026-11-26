import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogPostsService } from './blog-posts.service';
import { Public } from '../../../common/decorators/public.decorator';
import { toPublicImage } from '../../media/media.types';
import { BlogPostEntity } from './entities/blog-post.entity';

/** Sin metadatos internos de las imágenes (nombre original, id de archivo). */
function toPublicPost({ coverImageFileId: _fileId, gallery, ...post }: BlogPostEntity) {
  return { ...post, gallery: (gallery ?? []).map(toPublicImage) };
}

/** Lectura pública del Blog (sección 2 del encargo). Antes el sitio leía `src/data/blog.ts` estático. */
@ApiTags('Contenido - Blog (público)')
@Controller('public/blog')
export class PublicBlogController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar publicaciones publicadas del Blog (público)' })
  async findAll() {
    const posts = await this.blogPostsService.findAll();
    return posts.filter((p) => p.status === 'PUBLISHED').map(toPublicPost);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Obtener una publicación publicada por slug (público)' })
  async findBySlug(@Param('slug') slug: string) {
    const posts = await this.blogPostsService.findAll();
    const post = posts.find((p) => p.slug === slug && p.status === 'PUBLISHED');
    if (!post) throw new NotFoundException(`No existe una publicación de blog publicada con el slug ${slug}`);
    return toPublicPost(post);
  }
}
