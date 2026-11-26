import { apiGet } from "@/lib/api/client"
import type { GalleryImage, NewsArticle, NewsContentBlock } from "@/data/news"

/** Imagen por defecto cuando una noticia no tiene portada (evita `<Image src="">`). */
const DEFAULT_NEWS_IMAGE = "/images/noticias/hero.png"

/** Forma real devuelta por `/api/v1/public/news` (backend NestJS, Etapa 9). */
export interface PublicNewsPost {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  category: string | null
  coverImageUrl: string | null
  status: "PUBLISHED" | "DRAFT"
  publishedAt: string | null
  subtitle?: string | null
  imageAlt?: string | null
  contentBlocks?: NewsContentBlock[]
  seoTitle?: string | null
  seoDescription?: string | null
  isFeatured?: boolean
  gallery?: GalleryImage[]
}

/** Adapta la respuesta real de la API a la forma `NewsArticle` que ya consumen NewsCard/etc. */
export function toNewsArticle(post: PublicNewsPost): NewsArticle {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle ?? "",
    category: post.category ?? "",
    image: post.coverImageUrl || DEFAULT_NEWS_IMAGE,
    imageAlt: post.imageAlt ?? post.title,
    excerpt: post.summary,
    content: post.contentBlocks?.length ? post.contentBlocks : [{ type: "paragraph", text: post.content }],
    gallery: post.gallery ?? [],
    featured: post.isFeatured ?? false,
    publishedAt: post.publishedAt ?? undefined,
    seo: { title: post.seoTitle ?? post.title, description: post.seoDescription ?? post.summary },
  }
}

async function getAllPublished(): Promise<NewsArticle[]> {
  const posts = await apiGet<PublicNewsPost[]>("/public/news")
  return posts.map(toNewsArticle)
}

export const newsPublicService = {
  getAll: getAllPublished,

  getFeatured: async (): Promise<NewsArticle> => {
    const articles = await getAllPublished()
    return articles.find((a) => a.featured) ?? articles[0]
  },

  getOthers: async (): Promise<NewsArticle[]> => {
    const articles = await getAllPublished()
    const featured = articles.find((a) => a.featured) ?? articles[0]
    return articles.filter((a) => a.slug !== featured?.slug)
  },

  getBySlug: async (slug: string): Promise<NewsArticle | undefined> => {
    const post = await apiGet<PublicNewsPost>(`/public/news/${slug}`).catch(() => null)
    return post ? toNewsArticle(post) : undefined
  },

  getRelated: async (slug: string, limit = 3): Promise<NewsArticle[]> => {
    const articles = await getAllPublished()
    return articles.filter((a) => a.slug !== slug).slice(0, limit)
  },
}
