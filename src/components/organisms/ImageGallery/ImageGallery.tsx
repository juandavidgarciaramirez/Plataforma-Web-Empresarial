import Image from "next/image"
import { cn } from "@/lib/utils/cn"
import type { GalleryImage } from "@/data/news"

interface ImageGalleryProps {
  images: GalleryImage[]
  /** Texto alternativo de respaldo cuando una imagen no tiene `alt`. */
  fallbackAlt: string
  title?: string
  className?: string
}

/**
 * Galería de imágenes administrables (Etapa 15) para artículos, servicios y
 * vacantes. Usa `next/image` (tamaños adaptables, AVIF/WebP y carga diferida);
 * con ancho/alto conocidos reserva la proporción real y evita saltos de
 * contenido. No renderiza nada si no hay imágenes.
 */
export function ImageGallery({ images, fallbackAlt, title, className }: ImageGalleryProps) {
  if (images.length === 0) return null

  const columns = images.length === 1 ? "grid-cols-1" : images.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
  const sizes =
    images.length === 1 ? "(min-width: 1024px) 768px, 100vw" : images.length === 2 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"

  return (
    <section className={cn("space-y-5", className)} aria-label={title ?? "Galería de imágenes"}>
      {title && <h2 className="font-display text-2xl font-bold text-corporate-dark dark:text-white">{title}</h2>}
      <div className={cn("grid grid-cols-1 gap-4", columns)}>
        {images.map((image, index) => {
          const alt = image.alt || `${fallbackAlt} — imagen ${index + 1}`
          return (
            <figure key={image.url} className="overflow-hidden rounded-xl bg-slate-100 shadow-sm dark:bg-slate-900">
              {image.width && image.height ? (
                <Image
                  src={image.url}
                  alt={alt}
                  width={image.width}
                  height={image.height}
                  sizes={sizes}
                  className="h-auto w-full object-cover"
                />
              ) : (
                <div className="relative aspect-[4/3]">
                  <Image src={image.url} alt={alt} fill sizes={sizes} className="object-cover" />
                </div>
              )}
            </figure>
          )
        })}
      </div>
    </section>
  )
}
