import { Prisma } from '../../../../prisma/generated';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { ContentStatus } from './content.types';

/** Compartido por Blog y Noticias — ambos son `content.posts` distinguidos por `post_type` (Etapa 5). */
export const POST_INCLUDE = {
  post_category_relations: { include: { post_categories: { select: { name: true } } }, take: 1 },
} as const;

export type PostRow = {
  id: bigint;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  author_name: string | null;
  cover_image_url: string | null;
  featured_image_file_id?: bigint | null;
  status: string;
  published_at: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  post_category_relations: { post_categories: { name: string } }[];
  /** Campos ricos agregados en Etapa 9 (bloques estructurados, conclusión, CTA, SEO, autor con foto). */
  subtitle?: string | null;
  image_alt?: string | null;
  content_blocks?: Prisma.JsonValue | null;
  conclusion?: Prisma.JsonValue | null;
  cta_label?: string | null;
  cta_href?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  author_role?: string | null;
  author_image_url?: string | null;
  tags?: Prisma.JsonValue | null;
  is_featured?: boolean;
};

export type PostContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string };

export function readContentBlocks(value: Prisma.JsonValue | null | undefined): PostContentBlock[] {
  return Array.isArray(value) ? (value as unknown as PostContentBlock[]) : [];
}

export function readStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

export function readCategory(row: PostRow): string | null {
  return row.post_category_relations[0]?.post_categories.name ?? null;
}

export function toBigIntOrNull(id: string | null | undefined): bigint | null {
  return id && /^\d+$/.test(id) ? BigInt(id) : null;
}

export function toDbStatus(status: ContentStatus): string {
  return status;
}

export function toAppStatus(dbStatus: string): ContentStatus {
  return dbStatus === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
}

/** Busca una categoría real por nombre (case-insensitive); si no existe, la crea. */
async function findOrCreateCategoryId(prisma: PrismaService, name: string): Promise<bigint> {
  const trimmed = name.trim();
  const existing = await prisma.post_categories.findFirst({
    where: { name: { equals: trimmed, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return existing.id;

  const slug = trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const created = await prisma.post_categories.create({
    data: { name: trimmed, slug: slug || `categoria-${Date.now()}` },
    select: { id: true },
  });
  return created.id;
}

/** Reemplaza la (única) relación de categoría de un post — null la borra sin crear una nueva. */
export async function setPostCategory(prisma: PrismaService, postId: bigint, category: string | null): Promise<void> {
  await prisma.post_category_relations.deleteMany({ where: { post_id: postId } });
  if (!category) return;

  const categoryId = await findOrCreateCategoryId(prisma, category);
  await prisma.post_category_relations.create({ data: { post_id: postId, category_id: categoryId } });
}
