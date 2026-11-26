import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/organisms/Navbar/Navbar"
import { Footer } from "@/components/organisms/Footer/Footer"
import { JobDetail } from "@/components/organisms/JobDetail/JobDetail"
import { ApplicationForm } from "@/components/organisms/ApplicationForm/ApplicationForm"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"
import { getAllPositions } from "@/data/careers"
import { getPublicPosition } from "@/services/public/careers-public.service"
import { buildPageSeo } from "@/lib/seo/metadata"

/** ISR: las imágenes y vacantes administrables se reflejan en ≤ 1 minuto, aunque la API no respondiera durante el build. */
export const revalidate = 60

interface JobPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPositions().map((position) => ({ slug: position.slug }))
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params
  const position = await getPublicPosition(slug)

  if (!position) {
    return { title: "Vacante no encontrada" }
  }

  const title = `${position.cargo} | Trabaja con nosotros`

  return {
    title,
    description: position.descripcion,
    ...buildPageSeo({
      title,
      description: position.descripcion,
      path: `/trabaja-con-nosotros/${position.slug}`,
      image: position.imagen?.url,
    }),
  }
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params
  const position = await getPublicPosition(slug)

  if (!position) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="bg-white pb-16 pt-32 dark:bg-slate-950 md:pt-40">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <ScrollAnimation>
              <Link
                href="/trabaja-con-nosotros"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-corporate-blue"
              >
                <ArrowLeft className="h-4 w-4" />
                Trabaja con nosotros
              </Link>

              <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:gap-16">
                <JobDetail position={position} />

                <div id="postularme" className="rounded-2xl border border-border/40 bg-slate-50 p-6 shadow-sm dark:bg-slate-900/50 md:p-8">
                  <h2 className="font-display text-xl font-semibold text-foreground">Postularme</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Completa el formulario y adjunta tu hoja de vida para postularte a esta vacante.
                  </p>
                  <div className="mt-6">
                    <ApplicationForm vacancySlug={position.slug} vacancyTitle={position.cargo} />
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
