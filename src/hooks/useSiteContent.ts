"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/api/client"

/**
 * Contenido institucional real (Home / Nosotros / Organigrama, backend
 * NestJS — Etapa 7/8). Antes estas páginas leían las constantes estáticas
 * de `src/data/{about,hero,team}.ts`, desconectadas de cualquier backend.
 */

export interface HeroSlideItem {
  label: string
  /** Nombre del icono de lucide-react (ver `iconRegistry` en `@/lib/icon-registry`). */
  icon: string
}

export interface HeroSlide {
  id: string
  slug: string
  serviceCode: string | null
  nameWhite: string
  nameBlue: string
  title: string
  description: string | null
  imageUrl: string | null
  imagePosition: string | null
  href: string
  items: HeroSlideItem[]
  order: number
  isActive: boolean
}

export interface CompanyProfile {
  homeAboutEyebrow: string | null
  homeAboutTitle: string | null
  homeAboutText: string | null
  homeAboutImageUrl: string | null
  homeAboutStat1Value: string | null
  homeAboutStat1Label: string | null
  homeAboutStat2Value: string | null
  homeAboutStat2Label: string | null
  aboutHeroTitle: string | null
  aboutHeroSubtitle: string | null
  aboutHeroImageUrl: string | null
  aboutWhoTitle: string | null
  aboutWhoText: string | null
  aboutWhoImageUrl: string | null
  aboutMissionText: string | null
  aboutMissionImageUrl: string | null
  aboutVisionYear: string | null
  aboutVisionText: string | null
  aboutVisionImageUrl: string | null
  missionVisionIsPlaceholder: boolean
  aboutEcosystemTitle: string | null
  aboutEcosystemText: string | null
  aboutTeamTitle: string | null
  aboutTeamSubtitle: string | null
  aboutCtaTitle: string | null
  aboutCtaMessage: string | null
  aboutCtaImageUrl: string | null
}

export interface CompanyValue {
  id: string
  key: string
  title: string
  description: string | null
  /** Nombre del icono de lucide-react (ver `iconRegistry` en `@/lib/icon-registry`). */
  iconKey: string | null
  imageUrl: string | null
  order: number
  isActive: boolean
}

export interface WhoWeAreConcept {
  id: string
  key: string
  label: string
  description: string | null
  order: number
  isActive: boolean
}

export interface PublicTeamMember {
  id: string
  name: string
  position: string
  bio: string | null
  photoUrl: string | null
  /** Texto alternativo cargado desde el administrador (Etapa 15). */
  photoAlt?: string | null
  order: number
  status: "ACTIVE" | "INACTIVE"
  profession: string | null
  area: string | null
  serviceCode: string | null
  specialties: string[]
  certifications: string[] | null
  certificationsLabel: string | null
  isTransversal: boolean
  orgLevel: 1 | 2 | 3 | null
  parentId: string | null
  connectorCurve: "left" | "right" | null
}

export function useHeroSlides() {
  return useQuery({
    queryKey: ["site-content", "hero-slides"],
    queryFn: () => apiGet<HeroSlide[]>("/public/hero-slides"),
  })
}

export function useCompanyProfile() {
  return useQuery({
    queryKey: ["site-content", "company-profile"],
    queryFn: () => apiGet<CompanyProfile>("/public/company-profile"),
  })
}

export function useCompanyValues() {
  return useQuery({
    queryKey: ["site-content", "company-values"],
    queryFn: () => apiGet<CompanyValue[]>("/public/company-values"),
  })
}

export function useWhoWeAreConcepts() {
  return useQuery({
    queryKey: ["site-content", "who-we-are-concepts"],
    queryFn: () => apiGet<WhoWeAreConcept[]>("/public/who-we-are-concepts"),
  })
}

export function usePublicTeam() {
  return useQuery({
    queryKey: ["site-content", "team"],
    queryFn: () => apiGet<PublicTeamMember[]>("/public/team"),
  })
}
