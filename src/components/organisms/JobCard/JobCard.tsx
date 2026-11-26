import Link from "next/link"
import Image from "next/image"
import { MapPin, Briefcase, Clock, Calendar, ArrowRight } from "lucide-react"
import type { JobPosition } from "@/data/careers"

interface JobCardProps {
  position: JobPosition
}

export function JobCard({ position }: JobCardProps) {
  const fecha = new Date(position.fecha).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border/40 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl dark:bg-slate-950">
      {position.imagen && (
        <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/9] overflow-hidden rounded-t-2xl">
          <Image
            src={position.imagen.url}
            alt={position.imagen.alt || `Vacante ${position.cargo} en Capital Consulting`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      )}
      <span className="inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        {position.area}
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{position.cargo}</h3>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {position.ubicacion}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5" />
          {position.modalidad}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {position.tipoContrato}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {fecha}
        </span>
      </div>

      <Link
        href={`/trabaja-con-nosotros/${position.slug}`}
        className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary"
      >
        Ver oportunidad
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
