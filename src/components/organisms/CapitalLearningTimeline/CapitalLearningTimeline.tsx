"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { capitalLearningLines } from "@/data/capital-learning"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"

export function CapitalLearningTimeline() {
  return (
    <section id="portafolio" className="bg-slate-900 py-20 text-white md:py-28">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <ScrollAnimation>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-teal-400">
              Estructura del portafolio
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Siete líneas de formación
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Cubren el ciclo completo de seguridad, desempeño y cultura.
            </p>
          </div>
        </ScrollAnimation>

        {/* Ruta visual */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          {/* Línea central — desktop */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-teal-400/60 via-teal-400/25 to-teal-400/10 md:block"
          />
          {/* Línea lateral — mobile */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-teal-400/60 via-teal-400/25 to-teal-400/10 md:hidden"
          />

          <div className="space-y-16 md:space-y-28">
            {capitalLearningLines.map((line, index) => {
              const isReversed = index % 2 !== 0

              return (
                <div key={line.number} className="group relative pl-14 md:pl-0">
                  {/* Nodo numerado */}
                  <div className="absolute left-5 top-0 z-10 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal-400 bg-slate-900 font-display text-sm font-bold text-teal-400 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-400 group-hover:text-slate-900 md:h-16 md:w-16 md:text-lg">
                      {line.number}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-24">
                    {/* Contenido */}
                    <motion.div
                      initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6 }}
                      className={cn(isReversed ? "md:order-2" : "md:order-1")}
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-teal-400" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
                          Línea {line.number}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                        {line.detailTitle ?? line.title}
                      </h3>

                      {line.description && (
                        <p className="mt-3 text-sm text-slate-300 md:text-base">
                          {line.description}
                        </p>
                      )}

                      {line.temas && (
                        <div className="mt-5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            {line.temasLabel}
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {line.temas.map((tema) => (
                              <li
                                key={tema}
                                className="flex items-start gap-2 text-sm text-slate-300"
                              >
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-400" />
                                {tema}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {line.entregable && (
                        <div className="mt-5 rounded-lg border-l-2 border-teal-400 bg-white/5 px-4 py-3 backdrop-blur-sm">
                          <span className="text-xs font-semibold text-white">
                            Entregable:{" "}
                          </span>
                          <span className="text-xs text-slate-300">
                            {line.entregable}
                          </span>
                        </div>
                      )}
                    </motion.div>

                    {/* Imagen flotante */}
                    <motion.div
                      initial={{ opacity: 0, x: isReversed ? -40 : 40, scale: 0.96 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6 }}
                      className={cn("relative", isReversed ? "md:order-1" : "md:order-2")}
                    >
                      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-teal-400/10 blur-2xl transition-opacity duration-300 group-hover:bg-teal-400/20" />
                      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
                        <Image
                          src={line.image}
                          alt={line.detailTitle ?? line.title}
                          fill
                          sizes="(min-width: 768px) 40vw, 90vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
