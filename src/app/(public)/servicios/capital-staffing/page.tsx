import type { Metadata } from "next"
import Link from "next/link"
import { canonicalUrl } from "@/lib/seo/metadata"
import { SITE } from "@/config/site"
import Image from "next/image"
import {
  ArrowRight,
  Phone,
  Mail,
  AlertTriangle,
  RefreshCcw,
  ShieldAlert,
  AlertCircle,
  Target,
  CheckCircle2,
  Search,
  ClipboardCheck,
  ShieldCheck,
  MapPin,
  FileCheck,
  UserPlus,
  FileText,
  ClipboardList,
  Users,
  PackageCheck,
  Briefcase,
  Layers,
  Building2,
  Flame,
  HardHat,
  Truck,
  Factory,
  HeartPulse,
  Cpu,
  Award,
  Lock,
  Globe2,
  BadgeCheck,
  Handshake,
  Brain,
  GraduationCap,
  UserRound,
  TrendingUp,
} from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { ServiceHero } from "@/components/organisms/ServiceHero/ServiceHero"
import { ServiceGallerySection } from "@/components/organisms/ImageGallery/ServiceGallerySection"
import { getServiceMedia } from "@/services/public/services-public.service"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import {
  heroImage,
  contextImage,
  positioningImage,
  recruitmentImage,
  validationImage,
  processImage,
  positionsImage,
  sectorsImage,
  addedValueImage,
  ctaImage,
  contextIntroTitle,
  contextIntroText,
  contextItems,
  positioningIntroTitle,
  positioningIntroText,
  positioningItems,
  servicesIntro,
  staffingServices,
  processIntro,
  staffingProcess,
  positionsIntro,
  positionLevels,
  sectorsIntro,
  sectors,
  differentiators,
  addedValueIntro,
  addedValueItems,
  benefits,
  ctaTitle,
  ctaMessage,
  ctaPhone,
  ctaEmail,
} from "@/data/capital-staffing"

/** ISR: las imágenes y vacantes administrables se reflejan en ≤ 1 minuto, aunque la API no respondiera durante el build. */
export const revalidate = 60

export const metadata: Metadata = {
  title: "Capital Staffing | Capital Consulting & Services",
  description:
    "Capital Staffing: reclutamiento y selección que reduce el riesgo, acelera la operación y sostiene el crecimiento. Capital Consulting & Services.",
  keywords:
    "Capital Staffing, reclutamiento y selección, estudios de seguridad, visitas domiciliarias, verificación de referencias, headhunting, gestión del talento",
  alternates: { canonical: canonicalUrl("/servicios/capital-staffing") },
  openGraph: {
    title: "Capital Staffing | Reclutamiento y Selección",
    description:
      "Conectamos el mejor talento con las mejores empresas: reclutamiento que reduce el riesgo, acelera la operación y sostiene el crecimiento.",
    type: "website",
    locale: "es_CO",
    url: canonicalUrl("/servicios/capital-staffing"),
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capital Staffing | Reclutamiento y Selección",
    description:
      "Conectamos el mejor talento con las mejores empresas: reclutamiento que reduce el riesgo, acelera la operación y sostiene el crecimiento.",
    images: [SITE.defaultOgImage],
  },
}

const contextIcons = [AlertTriangle, RefreshCcw, ShieldAlert]
const positioningIcons = [AlertCircle, Target, CheckCircle2]
const serviceIcons = [Search, ClipboardCheck, ShieldCheck, MapPin, FileCheck, UserPlus]
const processIcons = [FileText, Search, ClipboardList, ShieldCheck, Users, RefreshCcw]
const positionIcons = [PackageCheck, Briefcase, Layers, Building2]
const sectorIcons = [Flame, HardHat, Truck, Factory, HeartPulse, Cpu]
const differentiatorIcons = [Award, Lock, Globe2, BadgeCheck, Handshake]
const addedValueIcons = [ShieldCheck, Users, Brain, GraduationCap]

export default async function CapitalStaffingPage() {
  // Imagen y galería administrables (Etapa 15); sin ellas se usa la imagen estática actual.
  const media = await getServiceMedia("capital-staffing")

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <ServiceHero
          image={media?.imageUrl ?? heroImage}
          imageAlt={(media?.imageUrl && media.imageAlt) || "Consultor de Capital Staffing validando la contratación de un candidato junto a su equipo"}
          imagePosition="65% 42%"
          eyebrow="Capital Staffing"
          title="Conectamos el mejor talento con las mejores empresas."
          description="Reclutamiento que reduce el riesgo, acelera la operación y sostiene el crecimiento."
          tag="Reclutamiento y selección"
          primaryCta={{ label: "Conocer nuestro proceso", href: "#proceso" }}
          secondaryCta={{ label: "Hablar con un asesor", href: "/contacto" }}
          highlights={[
            { label: "Talento", icon: <UserRound className="h-4 w-4" /> },
            { label: "Cultura", icon: <Users className="h-4 w-4" /> },
            { label: "Liderazgo", icon: <Target className="h-4 w-4" /> },
            { label: "Bienestar", icon: <HeartPulse className="h-4 w-4" /> },
            { label: "Productividad", icon: <TrendingUp className="h-4 w-4" /> },
          ]}
        />

        {/* EL CONTEXTO */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={contextImage}
                    alt="Equipo sobrecargado por una vacante crítica sin cubrir en Capital Consulting"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                    style={{ objectPosition: "68% 45%" }}
                  />
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    El contexto
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Lo que cuesta una vacante abierta
                  </h2>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {contextIntroTitle}
                  </h3>
                  <p className="mt-2 text-base text-muted-foreground">{contextIntroText}</p>
                </div>
              </ScrollAnimation>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {contextItems.map((item, index) => {
                const Icon = contextIcons[index]
                return (
                  <ScrollAnimation key={item.title} delay={index * 0.1}>
                    <div className="h-full rounded-xl border border-border/40 bg-slate-50 p-6 dark:bg-slate-900">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* ¿QUÉ ES CAPITAL STAFFING? */}
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation className="lg:order-2">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={positioningImage}
                    alt="Perfiles operativos, administrativos, de salud y ejecutivos gestionados por Capital Staffing"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} className="lg:order-1">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Posicionamiento
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    ¿Qué es Capital Staffing?
                  </h2>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {positioningIntroTitle}
                  </h3>
                  <p className="mt-2 text-base text-muted-foreground">{positioningIntroText}</p>
                </div>
              </ScrollAnimation>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {positioningItems.map((item, index) => {
                const Icon = positioningIcons[index]
                return (
                  <ScrollAnimation key={item.title} delay={index * 0.1}>
                    <div className="h-full rounded-xl border border-border/40 bg-white p-6 shadow-sm dark:bg-slate-950">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* NUESTROS SERVICIOS */}
        <section id="servicios" className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Portafolio
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Nuestros servicios
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">{servicesIntro}</p>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {staffingServices.map((service, index) => {
                const Icon = serviceIcons[index]
                return (
                  <ScrollAnimation key={service.number} delay={(index % 3) * 0.1}>
                    <div className="group flex h-full items-start gap-4 rounded-xl border border-border/40 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg dark:bg-slate-900">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold tracking-widest text-primary">
                          {service.number}
                        </span>
                        <h3 className="mt-1 font-display text-lg font-semibold">
                          {service.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              <ScrollAnimation>
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={recruitmentImage}
                    alt="Entrevista de selección de Capital Staffing con revisión de hoja de vida"
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
              <ScrollAnimation delay={0.1}>
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={validationImage}
                    alt="Analista de Capital Staffing revisando un informe de verificación de antecedentes"
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section id="proceso" className="bg-slate-900 py-20 text-white md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollAnimation>
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-teal-400">
                    Metodología
                  </span>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Nuestro proceso
                  </h2>
                  <p className="mt-4 text-lg text-slate-300">{processIntro}</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.15} direction="right">
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
                  <Image
                    src={processImage}
                    alt="Comité de Capital Staffing evaluando el proceso de selección de un candidato"
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </ScrollAnimation>
            </div>

            <div className="relative mt-16">
              <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/10 lg:block" />

              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
                {staffingProcess.map((item, index) => {
                  const Icon = processIcons[index]
                  return (
                    <ScrollAnimation key={item.step} delay={index * 0.08}>
                      <div className="relative text-center">
                        <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-400 text-slate-900 shadow-lg shadow-teal-400/20">
                          <span className="font-display text-xl font-bold">{item.step}</span>
                        </div>
                        <div className="mx-auto mt-4 flex h-8 w-8 items-center justify-center text-teal-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-display text-base font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                      </div>
                    </ScrollAnimation>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CARGOS QUE CUBRIMOS */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Cobertura
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Cargos que cubrimos
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">{positionsIntro}</p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.1}>
              <div className="relative mt-12 aspect-[16/7] overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={positionsImage}
                  alt="Cargos operativos, administrativos, profesionales y ejecutivos gestionados por Capital Staffing"
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
            </ScrollAnimation>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {positionLevels.map((item, index) => {
                const Icon = positionIcons[index]
                return (
                  <ScrollAnimation key={item.number} delay={index * 0.1}>
                    <div className="h-full rounded-xl border border-border/40 bg-slate-50 p-6 dark:bg-slate-900">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* SECTORES */}
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Experiencia
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Sectores</h2>
                <p className="mt-4 text-lg text-muted-foreground">{sectorsIntro}</p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.1}>
              <div className="relative mt-12 aspect-[16/7] overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={sectorsImage}
                  alt="Sectores atendidos por Capital Staffing: hidrocarburos, construcción, transporte, manufactura, salud y tecnología"
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
            </ScrollAnimation>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sectors.map((sector, index) => {
                const Icon = sectorIcons[index]
                return (
                  <ScrollAnimation key={sector.title} delay={(index % 3) * 0.1}>
                    <div className="flex h-full items-center gap-3 rounded-lg border-l-2 border-primary bg-white px-4 py-3.5 shadow-sm dark:bg-slate-950">
                      <Icon className="h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <span className="text-sm font-semibold text-foreground">
                          {sector.title}
                        </span>
                        <p className="text-xs text-muted-foreground">{sector.description}</p>
                      </div>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* NUESTRA DIFERENCIA */}
        <section className="bg-white py-20 dark:bg-slate-950 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Nuestra diferencia
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  ¿Por qué Capital Consulting?
                </h2>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {differentiators.map((item, index) => {
                const Icon = differentiatorIcons[index]
                return (
                  <ScrollAnimation key={item.number} delay={index * 0.08}>
                    <div className="group h-full rounded-xl border border-border/40 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg dark:bg-slate-900">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="mt-4 block text-xs font-semibold tracking-widest text-primary">
                        {item.number}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* VALOR AGREGADO */}
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50 md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Valor agregado
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Más allá de la selección
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">{addedValueIntro}</p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.1}>
              <div className="relative mt-12 aspect-[3/2] overflow-hidden rounded-2xl shadow-xl md:aspect-[16/8]">
                <Image
                  src={addedValueImage}
                  alt="Presentación del plan anual de bienestar y desarrollo de Capital Staffing: SG-SST, clima organizacional, riesgo psicosocial y capacitación"
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
            </ScrollAnimation>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {addedValueItems.map((item, index) => {
                const Icon = addedValueIcons[index]
                return (
                  <ScrollAnimation key={item.title} delay={index * 0.1}>
                    <div className="h-full rounded-xl border border-border/40 bg-white p-6 shadow-sm dark:bg-slate-950">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="bg-slate-900 py-20 text-white md:py-28">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-teal-400">
                  Valor para su empresa
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Beneficios para su empresa
                </h2>
              </div>
            </ScrollAnimation>

            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <ScrollAnimation key={benefit} delay={(index % 4) * 0.06}>
                  <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-white">{benefit}</span>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section id="contacto" className="relative overflow-hidden py-20 text-white md:py-28">
          <Image
            src={ctaImage}
            alt="Acuerdo entre Capital Staffing y un cliente tras definir el plan de cobertura de vacantes"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/50" />

          <div className="container relative mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <div className="max-w-xl">
                <span className="text-sm font-semibold tracking-[0.2em] text-teal-400">
                  SIGUIENTE PASO
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">{ctaTitle}</h2>
                <p className="mt-4 text-lg text-slate-300">{ctaMessage}</p>

                <div className="mt-8 flex flex-col gap-3 text-base">
                  <a
                    href={`tel:+57${ctaPhone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 font-semibold text-white transition-colors hover:text-teal-400"
                  >
                    <Phone className="h-4 w-4" />
                    {ctaPhone}
                  </a>
                  <a
                    href={`mailto:${ctaEmail}`}
                    className="flex items-center gap-2 text-slate-300 transition-colors hover:text-teal-400"
                  >
                    <Mail className="h-4 w-4" />
                    {ctaEmail}
                  </a>
                </div>

                <div className="mt-10">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
                  >
                    Hablar con un asesor
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>
        <ServiceGallerySection media={media} />
      </main>
      <Footer />
    </>
  )
}
