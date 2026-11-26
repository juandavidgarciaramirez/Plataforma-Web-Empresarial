import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import type { PublicServiceMedia } from "@/services/public/services-public.service"
import { ImageGallery } from "./ImageGallery"

/** Galería de la página de un servicio; solo aparece si el administrador cargó imágenes adicionales. */
export function ServiceGallerySection({ media }: { media: PublicServiceMedia | null }) {
  if (!media || media.gallery.length === 0) return null
  return (
    <section className="bg-white py-16 dark:bg-slate-950 md:py-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <ScrollAnimation>
          <ImageGallery images={media.gallery} fallbackAlt={media.name} title={`${media.name} en imágenes`} />
        </ScrollAnimation>
      </div>
    </section>
  )
}
