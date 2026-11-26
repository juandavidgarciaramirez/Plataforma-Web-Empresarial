import { MapPin, Briefcase, Clock, Calendar } from "lucide-react"
import Image from "next/image"
import type { JobPosition } from "@/data/careers"
import { ImageGallery } from "@/components/organisms/ImageGallery/ImageGallery"

interface JobDetailProps {
  position: JobPosition
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function JobDetail({ position }: JobDetailProps) {
  const fecha = new Date(position.fecha).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-10">
      {position.imagen && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={position.imagen.url}
            alt={position.imagen.alt || `Vacante ${position.cargo} en Capital Consulting`}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div>
        <span className="inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {position.area}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">{position.cargo}</h1>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {position.ubicacion}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            {position.modalidad}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {position.tipoContrato}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {fecha}
          </span>
        </div>
      </div>

      <p className="text-lg leading-relaxed text-muted-foreground">{position.descripcion}</p>

      <ListSection title="Responsabilidades" items={position.responsabilidades} />
      <ListSection title="Requisitos" items={position.requisitos} />
      <ListSection title="Qué ofrecemos" items={position.queOfrecemos} />

      {position.galeria && position.galeria.length > 0 && (
        <ImageGallery images={position.galeria} fallbackAlt={position.cargo} title="Conoce el entorno" />
      )}
    </div>
  )
}
