import { ContentStatus } from '../../common/content.types';
import { PostContentBlock } from '../../common/prisma-post.util';
import { MediaImage } from '../../../media/media.types';

export class BlogPostEntity {
  id!: string;
  slug!: string;
  title!: string;
  excerpt!: string;
  content!: string;
  author!: string | null;
  category!: string | null;
  coverImageUrl!: string | null;
  status!: ContentStatus;
  publishedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;

  /**
   * Campos ricos (Etapa 9) — ver src/data/blog.ts, contenido real migrado.
   * Opcionales: el formulario admin actual solo gestiona los campos base;
   * estos los trae el contenido migrado y podrán editarse desde el admin
   * cuando exista una pantalla dedicada a contenido enriquecido.
   */
  subtitle?: string | null;
  imageAlt?: string | null;
  contentBlocks?: PostContentBlock[];
  conclusion?: string[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  authorRole?: string | null;
  authorImageUrl?: string | null;
  tags?: string[];
  isFeatured?: boolean;

  /** Imágenes administrables (Etapa 15): archivo de la imagen principal y galería adicional. */
  coverImageFileId?: string | null;
  gallery?: MediaImage[];
}
