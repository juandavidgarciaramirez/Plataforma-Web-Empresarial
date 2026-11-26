"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectFade,
} from "swiper/modules"

import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"
import "swiper/css/navigation"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/atoms/Button"
import { useHeroSlides } from "@/hooks/useSiteContent"

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { data: heroSlides } = useHeroSlides()
  const total = heroSlides?.length ?? 0

  // Mientras carga (o si la API no responde) se mantiene el fondo institucional
  // sin contenido, en vez de mostrar datos de relleno.
  if (!heroSlides || heroSlides.length === 0) {
    return (
      <section className="relative h-[560px] w-full overflow-hidden bg-[#061a35] sm:h-[620px] md:h-[680px] lg:h-[700px]" />
    )
  }

  return (
    <section className="relative h-[560px] w-full overflow-hidden bg-[#061a35] sm:h-[620px] md:h-[680px] lg:h-[700px]">

      <Swiper
        modules={[
          Autoplay,
          Pagination,
          Navigation,
          EffectFade,
        ]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        autoplay={{
          delay: 6500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation
        loop
        onSwiper={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
        onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >

        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>

            <div className="relative h-full w-full overflow-hidden bg-[#061a35]">

              {/* =====================================================
                  FONDO
              ====================================================== */}

              <div className="absolute inset-0 bg-[#061a35]" />

              {/* =====================================================
                  IMAGEN
              ====================================================== */}

              <div className="absolute inset-y-0 right-0 z-0 w-full md:w-[59%]">

                <Image
                  src={slide.imageUrl ?? ""}
                  alt={`${slide.nameWhite} ${slide.nameBlue}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 59vw"
                  className="object-cover"
                  style={{ objectPosition: slide.imagePosition ?? "center" }}
                />

                {/* Degradado suave hacia el contenido: funde el borde izquierdo de la foto */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#061a35]/30" />

                {/* Degradado inferior muy sutil, refuerza la composición */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#061a35]/20 via-transparent to-transparent" />

              </div>

              {/* =====================================================
                  TRANSICIÓN — una sola curva, delgada y sutil
              ====================================================== */}

              <div
                className="pointer-events-none absolute right-[36%] top-[-15%] z-[3] hidden h-[130%] w-[150px] rotate-[6deg] rounded-[50%] border-l-[3px] border-[#1684d8]/35 md:block"
              />

              {/* =====================================================
                  DEGRADADO DEL ÁREA DE CONTENIDO — mezcla gradual
              ====================================================== */}

              <div
                className="absolute inset-y-0 left-0 z-[5] w-[82%] bg-gradient-to-r from-[#061a35] via-[#061a35]/95 to-transparent sm:w-[76%] md:w-[68%]"
              />

              {/* =====================================================
                  CONTENIDO
              ====================================================== */}

              <div className="relative z-10 flex h-full items-center">

                <div className="container mx-auto px-6 md:px-10 lg:px-16 xl:px-20">

                  <motion.div
                    key={slide.id}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                    className="w-full max-w-[520px] md:max-w-[480px] lg:max-w-[520px]"
                  >

                    {/* =================================================
                        NOMBRE DE LA LÍNEA DE NEGOCIO (eyebrow)
                    ================================================== */}

                    <div className="flex items-center gap-3">
                      <span className="h-[2px] w-6 bg-[#f28c28]" />
                      <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] sm:text-sm">
                        <span className="text-white">{slide.nameWhite}</span>{" "}
                        <span className="text-[#1684d8]">{slide.nameBlue}</span>
                      </p>
                    </div>

                    {/* =================================================
                        HEADLINE — protagonista
                    ================================================== */}

                    <h1 className="mt-4 max-w-[480px] text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-white [text-wrap:balance] sm:text-[32px] md:text-[34px] lg:text-[38px]">
                      {slide.title}
                    </h1>

                    {/* =================================================
                        DESCRIPCIÓN
                    ================================================== */}

                    <p className="mt-4 max-w-[440px] text-[15px] leading-7 text-white/65 md:text-[16px]">
                      {slide.description}
                    </p>

                    {/* =================================================
                        CTA
                    ================================================== */}

                    <div className="mt-8">

                      <Link href={slide.href}>

                        <Button
                          variant="corporate"
                          size="lg"
                          className="group gap-2 rounded-lg px-6 shadow-md shadow-[#1684d8]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1684d8]/35"
                        >
                          Conocer más
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>

                      </Link>

                    </div>

                  </motion.div>

                </div>

              </div>

              {/* =====================================================
                  INDICADOR "01 / 05" + BARRA DE PROGRESO
              ====================================================== */}

              <div className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 rounded-full border border-white/10 bg-[#061a35]/35 px-3.5 py-2 backdrop-blur-sm md:right-10 lg:right-16 xl:right-20 sm:flex">
                <span className="font-display text-xs font-medium tabular-nums text-white/80">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <span className="h-[3px] w-10 overflow-hidden rounded-full bg-white/15">
                  <span
                    className="block h-full rounded-full bg-[#1684d8] transition-all duration-500 ease-out"
                    style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
                  />
                </span>
              </div>

            </div>

          </SwiperSlide>
        ))}

      </Swiper>

      {/* ===========================================================
          PAGINACIÓN Y NAVEGACIÓN
      ============================================================ */}

      <style jsx global>{`

        .swiper-pagination {
          bottom: 25px !important;
          left: 28px !important;
          width: auto !important;
          transform: none;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .swiper-pagination-bullet {
          width: 18px;
          height: 3px;
          margin: 0 !important;
          border-radius: 999px;
          background: rgba(255,255,255,0.3) !important;
          opacity: 1;
          transition: all 0.35s ease;
        }

        .swiper-pagination-bullet-active {
          width: 34px;
          background: #1684d8 !important;
        }

        /* =========================================================
           NAVEGACIÓN — discreta
        ========================================================== */

        .swiper-button-next,
        .swiper-button-prev {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          color: white !important;
          backdrop-filter: blur(8px);
          transition:
            background 0.3s ease,
            border-color 0.3s ease,
            transform 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(22,132,216,0.25);
          border-color: rgba(22,132,216,0.5);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 13px !important;
          font-weight: 700;
        }

        /* =========================================================
           MOBILE
        ========================================================== */

        @media (max-width: 768px) {

          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }

          .swiper-pagination {
            bottom: 18px !important;
            left: 24px !important;
          }
        }

      `}</style>

    </section>
  )
}
