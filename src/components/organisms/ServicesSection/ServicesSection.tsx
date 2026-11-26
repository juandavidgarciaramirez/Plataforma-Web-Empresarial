"use client"

import { Card } from "@/components/molecules/Card"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { services } from "@/data/services"
import Image from "next/image"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/api/client"
import type { PublicServiceMedia } from "@/services/public/services-public.service"

export function ServicesSection() {
  // Imagen administrable de cada línea (Etapa 15). Sin ella —o si la API no responde— la tarjeta conserva su ícono.
  const { data: media } = useQuery({
    queryKey: ["public-services-media"],
    queryFn: () => apiGet<PublicServiceMedia[]>("/public/services"),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <section id="servicios" className="scroll-mt-24 py-20 md:py-28 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <ScrollAnimation>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Nuestros servicios
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-5xl font-bold">
              Soluciones que transforman
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ofrecemos un portafolio integral de servicios diseñados para
              impulsar el crecimiento y la competitividad de tu empresa.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            const image = media?.find((item) => item.slug === service.slug)
            return (
              <ScrollAnimation key={service.slug} delay={index * 0.1}>
                <Card
                  title={service.name}
                  description={service.description}
                  hoverEffect
                  className="group"
                >
                  {image?.imageUrl ? (
                    <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg">
                      <Image
                        src={image.imageUrl}
                        alt={image.imageAlt || service.name}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="mt-4">
                    <Link
                      href={service.href}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Conocer más →
                    </Link>
                  </div>
                </Card>
              </ScrollAnimation>
            )
          })}
        </div>

        <div className="mt-12 text-center">
         
        </div>
      </div>
    </section>
  )
}