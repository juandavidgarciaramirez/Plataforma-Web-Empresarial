import { apiGet } from "@/lib/api/client"
import type { BlogArticle, BlogCategory, BlogContentBlock } from "@/data/blog"
import type { GalleryImage } from "@/data/news"

/** Imagen por defecto cuando un artículo no tiene portada (evita `<Image src="">`). */
const DEFAULT_BLOG_IMAGE = "/images/blog/hero.png"

/** Forma real devuelta por `/api/v1/public/blog` (backend NestJS, Etapa 9). */
export interface PublicBlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string | null
  category: string | null
  coverImageUrl: string | null
  status: "PUBLISHED" | "DRAFT"
  publishedAt: string | null
  subtitle?: string | null
  imageAlt?: string | null
  contentBlocks?: BlogContentBlock[]
  conclusion?: string[]
  ctaLabel?: string | null
  ctaHref?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  authorRole?: string | null
  authorImageUrl?: string | null
  tags?: string[]
  isFeatured?: boolean
  gallery?: GalleryImage[]
}

/** Adapta la respuesta real de la API a la forma `BlogArticle` que ya consumen BlogCard/BlogExplorer/etc. */
export function toBlogArticle(post: PublicBlogPost): BlogArticle {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle ?? "",
    excerpt: post.excerpt,
    content: post.contentBlocks?.length ? post.contentBlocks : [{ type: "paragraph", text: post.content }],
    conclusion: post.conclusion ?? [],
    image: post.coverImageUrl || DEFAULT_BLOG_IMAGE,
    gallery: post.gallery ?? [],
    imageAlt: post.imageAlt ?? post.title,
    category: (post.category ?? "GESTIÓN EMPRESARIAL") as BlogCategory,
    author: {
      name: post.author ?? "Equipo Capital Consulting",
      role: post.authorRole ?? "Capital Consulting and Services SAS",
      image: post.authorImageUrl ?? undefined,
    },
    publishedAt: post.publishedAt ? post.publishedAt.slice(0, 10) : "",
    featured: post.isFeatured ?? false,
    tags: post.tags ?? [],
    cta: { label: post.ctaLabel ?? "Conocer más →", href: post.ctaHref ?? "/servicios" },
    seo: { title: post.seoTitle ?? post.title, description: post.seoDescription ?? post.excerpt },
  }
}

async function getAllPublished(): Promise<BlogArticle[]> {
  const posts = await apiGet<PublicBlogPost[]>("/public/blog")
  return posts.map(toBlogArticle)
}

export const blogPublicService = {
  getAll: getAllPublished,

  getFeatured: async (): Promise<BlogArticle> => {
    const articles = await getAllPublished()
    return articles.find((a) => a.featured) ?? articles[0]
  },

  getOthers: async (): Promise<BlogArticle[]> => {
    const articles = await getAllPublished()
    const featured = articles.find((a) => a.featured) ?? articles[0]
    return articles.filter((a) => a.slug !== featured?.slug)
  },

  getActiveCategories: async (): Promise<BlogCategory[]> => {
    const articles = await getAllPublished()
    return Array.from(new Set(articles.map((a) => a.category)))
  },

  getBySlug: async (slug: string): Promise<BlogArticle | undefined> => {
    const post = await apiGet<PublicBlogPost>(`/public/blog/${slug}`).catch(() => null)
    return post ? toBlogArticle(post) : undefined
  },

  getRelated: async (slug: string, limit = 3): Promise<BlogArticle[]> => {
    const articles = await getAllPublished()
    const current = articles.find((a) => a.slug === slug)
    const rest = articles.filter((a) => a.slug !== slug)
    if (!current) return rest.slice(0, limit)
    const sameCategory = rest.filter((a) => a.category === current.category)
    const others = rest.filter((a) => a.category !== current.category)
    return [...sameCategory, ...others].slice(0, limit)
  },
}
