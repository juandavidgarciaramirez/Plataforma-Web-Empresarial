import { ContentStatus } from '../../common/content.types';
import { PostContentBlock } from '../../common/prisma-post.util';
import { MediaImage } from '../../../media/media.types';

export class NewsEntity {
  id!: string;
  slug!: string;
  title!: string;
  summary!: string;
  content!: string;
  category!: string | null;
  coverImageUrl!: string | null;
  status!: ContentStatus;
  publishedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;

  /** Campos ricos (Etapa 9) — ver src/data/news.ts, contenido real migrado. Opcionales, ver nota en BlogPostEntity. */
  subtitle?: string | null;
  imageAlt?: string | null;
  contentBlocks?: PostContentBlock[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  isFeatured?: boolean;

  /** Imágenes administrables (Etapa 15): archivo de la imagen principal y galería adicional. */
  coverImageFileId?: string | null;
  gallery?: MediaImage[];
}
