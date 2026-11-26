"use client"

import { motion } from "framer-motion"
import { HeroCarousel } from "@/components/organisms/HeroCarousel/HeroCarousel"
import { ServicesSection } from "@/components/organisms/ServicesSection/ServicesSection"
import { AboutSection } from "@/components/organisms/AboutSection/AboutSection"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { useScrollReveal } from "@/hooks/useScrollReveal"

/**
 * Cuerpo interactivo de la Home (Client Component: usa hooks y
 * framer-motion). Separado de `page.tsx` porque un Client Component no
 * puede exportar `metadata` — brief SEO sección 3.
 */
export function HomeContent() {
  useScrollReveal()

  return (
    <>
      <Navbar />
      <main>
        <HeroCarousel />

        <ScrollAnimation>
          <ServicesSection />
        </ScrollAnimation>

        <ScrollAnimation>
          <AboutSection />
        </ScrollAnimation>

        {/* Las demás secciones las añadirás después */}
        <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50">
          <p className="text-muted-foreground">

          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
