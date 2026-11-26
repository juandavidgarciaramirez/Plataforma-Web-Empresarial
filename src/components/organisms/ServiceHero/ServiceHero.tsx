"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface ServiceHeroCta {
  label: string
  href: string
}

interface ServiceHeroHighlight {
  label: string
  /** Ícono ya renderizado (p. ej. `<Banknote className="h-4 w-4" />`), no el componente. */
  icon: ReactNode
}

interface ServiceHeroProps {
  image: string
  imageAlt: string
  eyebrow: string
  title: string
  description: string
  /** Texto breve opcional debajo de la descripción, p. ej. la línea de negocio. */
  tag?: string
  primaryCta: ServiceHeroCta
  secondaryCta?: ServiceHeroCta
  /**
   * object-position del `object-cover`, p. ej. "78% 20%". Úsalo para mantener
   * visible el punto de interés de la foto (un rostro, un producto) cuando el
   * recorte del hero no coincide con la proporción original de la imagen.
   * Por defecto "center".
   */
  imagePosition?: string
  /** Chips discretos opcionales debajo de la descripción, p. ej. las especialidades del servicio. Máx. 5 en desktop. */
  highlights?: ServiceHeroHighlight[]
}

// Entrada escalonada: categoría → título → línea → descripción → tag → chips → CTA.
const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const lineItem: Variants = {
  hidden: { opacity: 0, scaleX: 0.4 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

/**
 * Hero de página de servicio. Mismo lenguaje visual que HeroCarousel (foto
 * como panel protagonista, degradado de mezcla hacia el fondo corporativo,
 * curva sutil como transición) con la jerarquía completa que necesita una
 * página de servicio: categoría, título, línea decorativa, descripción,
 * tag opcional, chips de especialidades y doble CTA. En mobile la imagen se
 * apila arriba y el contenido respira debajo, en vez de forzar la
 * composición de escritorio.
 */
export function ServiceHero({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  tag,
  primaryCta,
  secondaryCta,
  imagePosition = "center",
  highlights,
}: ServiceHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-corporate-dark">
      {/* IMAGEN — banda superior en mobile, panel derecho a partir de md */}
      <div className="relative h-[280px] w-full sm:h-[340px] md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[56%] lg:w-[54%]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          style={{ objectPosition: imagePosition }}
          sizes="(max-width: 767px) 100vw, 56vw"
        />
        {/* Degradado inferior sutil (mobile): funde la imagen hacia el contenido */}
        <div className="absolute inset-0 bg-gradient-to-t from-corporate-dark via-corporate-dark/10 to-transparent md:hidden" />
        {/* Degradado lateral sutil (desktop): funde el borde izquierdo de la foto */}
        <div className="absolute inset-0 hidden bg-gradient-to-l from-transparent via-transparent to-corporate-dark/25 md:block" />
      </div>

      {/* Curva decorativa — sutil, solo desktop grande */}
      <div className="pointer-events-none absolute right-[41%] top-[-12%] z-[3] hidden h-[125%] w-[130px] rotate-[6deg] rounded-[50%] border-l-[3px] border-corporate-blue/40 lg:block" />

      {/* Degradado del área de contenido — da contraste al texto, solo desktop */}
      <div className="absolute inset-y-0 left-0 z-[4] hidden w-[72%] bg-gradient-to-r from-corporate-dark via-corporate-dark/95 to-transparent md:block lg:w-[64%] xl:w-[60%]" />

      {/* CONTENIDO */}
      <div className="relative z-10 flex w-full md:min-h-[620px] md:items-center lg:min-h-[720px] xl:min-h-[760px]">
        {/*
          Sin `container`: su tope de ancho por breakpoint centra esta caja con un
          margen que crece con el viewport real, desalineándola del degradado/imagen
          (medidos en % del viewport) justo en anchos de portátil (md/lg) — por eso
          el texto salía del recuadro oscuro. `w-full` + padding evita ese desfase.
          El padding-top también crece para despejar el navbar fijo (72px).
        */}
        <div className="w-full px-6 pb-10 pt-10 sm:px-8 sm:pb-12 sm:pt-12 md:px-12 md:pb-14 md:pt-24 lg:px-16 lg:pb-16 lg:pt-28 xl:px-20 xl:pt-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            className="max-w-full text-white sm:max-w-[480px] md:max-w-[440px] lg:max-w-[520px] xl:max-w-[600px] 2xl:max-w-[680px]"
          >
            <motion.span
              variants={item}
              className="inline-block rounded-full bg-primary px-4 py-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-foreground backdrop-blur-sm sm:text-sm"
            >
              {eyebrow}
            </motion.span>

            <motion.h1
              variants={item}
              className="mt-6 font-display text-[20px] font-bold leading-[1.05] tracking-tight text-white [text-wrap:balance] sm:text-[24px] md:mt-7 md:text-[32px] lg:text-[42px] xl:text-[50px] 2xl:text-[54px]"
            >
              {title}
            </motion.h1>

            <motion.div
              variants={lineItem}
              className="mt-[22px] h-1 w-20 origin-left rounded-full bg-corporate-orange sm:w-24"
            />

            <motion.p
              variants={item}
              className="mt-6 max-w-[520px] text-[20px] font-medium leading-[1.4] text-white/90 md:text-[22px] lg:text-[24px]"
            >
              {description}
            </motion.p>

            {tag && (
              <motion.p
                variants={item}
                className="mt-5 max-w-[520px] text-sm font-medium uppercase tracking-wider text-white/55"
              >
                {tag}
              </motion.p>
            )}

            {highlights && highlights.length > 0 && (
              <motion.div variants={item} className="mt-8 flex flex-wrap gap-2.5 md:gap-3">
                {highlights.slice(0, 5).map((highlightItem) => (
                  <span
                    key={highlightItem.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm"
                  >
                    <span className="text-white/70 [&_svg]:h-4 [&_svg]:w-4">
                      {highlightItem.icon}
                    </span>
                    {highlightItem.label}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href={primaryCta.href}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 sm:h-[52px] sm:px-8"
              >
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:h-[52px] sm:px-8"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
