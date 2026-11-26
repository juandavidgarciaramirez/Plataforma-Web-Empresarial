"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface InstitutionalHeroCta {
  label: string
  href: string
}

interface InstitutionalHeroProps {
  eyebrow: string
  title: string
  subtitle: string
  image: string
  imageAlt: string
  /**
   * object-position del `object-cover`, p. ej. "30% 20%". Úsalo para
   * mantener visible el punto de interés de la foto cuando el recorte no
   * coincide con la composición original. Por defecto "center".
   */
  imagePosition?: string
  /** Único CTA — usar solo cuando realmente aporte. */
  cta?: InstitutionalHeroCta
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const lineItem: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

/**
 * Hero institucional/editorial — Nosotros, PQR, Trabaja con nosotros,
 * Contacto, Blog, Noticias.
 *
 * Composición deliberadamente distinta al `ServiceHero` de las cinco líneas
 * de negocio (foto de fondo a pantalla completa con texto superpuesto):
 * aquí el contenido vive sobre un panel de color sólido y la fotografía
 * respira como panel propio, sin overlay, conservando luz y detalle. Máximo
 * 3 niveles de información (eyebrow, H1, subtítulo) + un único CTA opcional.
 */
export function InstitutionalHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  imagePosition = "center",
  cta,
}: InstitutionalHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-corporate-dark text-white">
      <div className="relative grid grid-cols-1 pt-[88px] lg:min-h-[600px] lg:grid-cols-2 lg:items-stretch lg:pt-24">
        {/* Contenido */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="relative z-10 order-2 flex flex-col justify-center px-6 py-14 sm:px-8 md:px-12 md:py-16 lg:order-1 lg:px-16 lg:py-20 xl:pl-20"
        >
          <div className="max-w-[520px]">
            <motion.span
              variants={item}
              className="block text-sm font-semibold uppercase tracking-[0.2em] text-corporate-orange"
            >
              {eyebrow}
            </motion.span>

            <motion.h1
              variants={item}
              className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
            >
              {title}
            </motion.h1>

            <motion.span
              variants={lineItem}
              style={{ transformOrigin: "left" }}
              className="mt-6 block h-[3px] w-16 rounded-full bg-corporate-orange"
            />

            <motion.p
              variants={item}
              className="mt-6 text-[17px] leading-[1.6] text-white/75 sm:text-lg lg:text-xl"
            >
              {subtitle}
            </motion.p>

            {cta && (
              <motion.div variants={item} className="mt-8">
                <Link
                  href={cta.href}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 sm:w-auto"
                >
                  {cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Imagen protagonista */}
        <div className="relative order-1 h-[260px] sm:h-[340px] lg:order-2 lg:h-full">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
        </div>

        {/* Único acento decorativo: una línea curva en el punto de encuentro */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[140%] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-l-2 border-corporate-blue/30 lg:block"
        />
      </div>
    </section>
  )
}
