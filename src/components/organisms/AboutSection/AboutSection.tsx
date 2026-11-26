"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { CheckCircle, ArrowRight, X, Volume2 } from "lucide-react"
import Link from "next/link"

export function AboutSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Reproducir automáticamente en silencio al cargar
  useEffect(() => {
    const video = videoRef.current

    if (video) {
      video.muted = true
      video.play().catch(() => {
        // Algunos navegadores pueden bloquear el autoplay
      })
    }
  }, [])

  // Abrir video emergente
  const openVideo = () => {
    setIsVideoOpen(true)
  }

  // Cerrar video emergente
  const closeVideo = () => {
    setIsVideoOpen(false)
  }

  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* =========================
                VIDEO CORPORATIVO
            ========================== */}
            <ScrollAnimation direction="left">
              <div
                className="relative aspect-video overflow-hidden rounded-xl shadow-2xl bg-black cursor-pointer group"
                onClick={openVideo}
              >
                <video
                  ref={videoRef}
                  src="/images/Video_Corporativo.mp4"
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                >
                  Tu navegador no soporta la reproducción de video.
                </video>

                {/* Capa al pasar el mouse */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

                {/* Botón visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-3 rounded-full bg-black/60 px-5 py-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <Volume2 className="w-5 h-5" />
                    <span className="font-medium">
                      Ver con sonido
                    </span>
                  </div>
                </div>

                {/* Etiqueta */}
                <div className="absolute bottom-4 left-4 rounded bg-black/60 px-3 py-1 text-sm text-white backdrop-blur-sm">
                  Video corporativo
                </div>
              </div>
            </ScrollAnimation>

            {/* =========================
                CONTENIDO
            ========================== */}
            <ScrollAnimation direction="right">
              <div>
                <span className="inline-block mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                  Sobre nosotros
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Transformamos procesos en{" "}
                  <span className="text-primary">
                    resultados
                  </span>
                </h2>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  En Capital Consulting & Services SAS acompañamos a las
                  organizaciones en la optimización de sus procesos,
                  fortaleciendo su operación y ayudándolas a alcanzar sus
                  objetivos estratégicos.
                </p>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  Combinamos experiencia, tecnología y conocimiento
                  especializado para ofrecer soluciones adaptadas a las
                  necesidades de cada organización.
                </p>

                {/* BENEFICIOS */}
                <div className="space-y-4 mb-8">

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Experiencia y conocimiento
                      </h3>

                      <p className="text-gray-600">
                        Profesionales comprometidos con la excelencia y el
                        desarrollo de nuestros clientes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Soluciones a la medida
                      </h3>

                      <p className="text-gray-600">
                        Diseñamos estrategias y soluciones alineadas con cada
                        necesidad empresarial.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Innovación y tecnología
                      </h3>

                      <p className="text-gray-600">
                        Incorporamos herramientas tecnológicas para mejorar la
                        eficiencia y productividad.
                      </p>
                    </div>
                  </div>

                </div>

                {/* BOTÓN */}
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:opacity-90"
                >
                  Conoce más sobre nosotros
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </ScrollAnimation>

          </div>
        </div>
      </section>

      {/* =====================================
          MODAL DEL VIDEO
      ====================================== */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* BOTÓN CERRAR */}
            <button
              type="button"
              onClick={closeVideo}
              className="absolute -top-12 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Cerrar video"
            >
              <X className="h-6 w-6" />
            </button>

            {/* VIDEO GRANDE */}
            <div className="overflow-hidden rounded-xl bg-black shadow-2xl">
              <video
                src="/images/Video_Corporativo.mp4"
                className="max-h-[85vh] w-full object-contain"
                controls
                autoPlay
                playsInline
              >
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>

          </div>
        </div>
      )}
    </>
  )
}