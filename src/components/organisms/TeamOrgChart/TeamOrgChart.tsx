"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, X, Award, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import type { PublicTeamMember } from "@/hooks/useSiteContent"
import { services } from "@/data/services"

interface OrgEdge {
  from: string
  to: string
  curve?: "left" | "right"
}

/** Deriva las conexiones del organigrama a partir de `parentId` de cada integrante. */
function buildEdges(members: PublicTeamMember[]): OrgEdge[] {
  return members
    .filter((m) => m.parentId)
    .map((m) => ({ from: m.parentId as string, to: m.id, curve: m.connectorCurve ?? undefined }))
}

/** Clases de columnas según cuántos integrantes tenga el nivel, para que el
 *  organigrama se mantenga equilibrado si se agregan o quitan perfiles. */
function levelGridCols(count: number) {
  if (count <= 1) return "grid-cols-1"
  if (count === 2) return "grid-cols-2"
  if (count === 3) return "grid-cols-3"
  return "grid-cols-2 xl:grid-cols-4"
}

/** Posición porcentual (x, y) de cada tarjeta dentro del lienzo del organigrama. */
function useNodePositions(members: PublicTeamMember[]) {
  return useMemo(() => {
    const levels: Record<number, PublicTeamMember[]> = { 1: [], 2: [], 3: [] }
    members.forEach((m) => {
      if (m.orgLevel) levels[m.orgLevel].push(m)
    })
    Object.values(levels).forEach((members) => members.sort((a, b) => a.order - b.order))
    const rowY: Record<number, number> = { 1: 12, 2: 50, 3: 88 }

    const positions = new Map<string, { x: number; y: number }>()
    Object.entries(levels).forEach(([lvl, levelMembers]) => {
      levelMembers.forEach((m, i) => {
        const x = ((i + 0.5) / levelMembers.length) * 100
        positions.set(m.id, { x, y: rowY[Number(lvl)] })
      })
    })
    return { levels, positions }
  }, [members])
}

function buildPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  curve?: "left" | "right"
) {
  if (curve) {
    const cx = curve === "right" ? 96 : 4
    const c1y = from.y + (to.y - from.y) * 0.3
    const c2y = from.y + (to.y - from.y) * 0.7
    return `M ${from.x} ${from.y} C ${cx} ${c1y}, ${cx} ${c2y}, ${to.x} ${to.y}`
  }
  const midY = (from.y + to.y) / 2
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`
}

interface MemberCardProps {
  member: PublicTeamMember
  featured?: boolean
  active: boolean
  dimmed: boolean
  onEnter: () => void
  onLeave: () => void
  onOpen: () => void
}

function MemberCard({ member, featured, active, dimmed, onEnter, onLeave, onOpen }: MemberCardProps) {
  return (
    <motion.button
      type="button"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-300 dark:bg-slate-950",
        featured ? "border-primary/30" : "border-border/40",
        active && "shadow-xl ring-1 ring-primary/40",
        dimmed && "opacity-40"
      )}
      style={{ maxWidth: featured ? 320 : 260 }}
      aria-haspopup="dialog"
    >
      <div className={cn("relative w-full overflow-hidden", featured ? "aspect-[4/5]" : "aspect-[4/5]")}>
        {member.photoUrl && (
          <Image
            src={member.photoUrl}
            alt={member.photoAlt || `Fotografía de ${member.name}, ${member.position} en Capital Consulting`}
            fill
            sizes="(min-width: 1024px) 300px, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
        {member.isTransversal && (
          <span className="absolute right-3 top-3 rounded-full border border-white/40 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Transversal
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-semibold text-foreground">{member.name}</h3>
        {featured && (
          <span className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Socia fundadora
          </span>
        )}
        {member.profession && <p className="mt-1 text-sm text-muted-foreground">{member.profession}</p>}

        {member.area && (
          <span
            className={cn(
              "mt-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300",
              active ? "bg-primary text-white" : "bg-primary/10 text-primary"
            )}
          >
            {member.area}
          </span>
        )}

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Ver perfil <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </motion.button>
  )
}

function ProfilePanel({ member, onClose }: { member: PublicTeamMember | null; onClose: () => void }) {
  useEffect(() => {
    if (!member) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [member, onClose])

  const relatedService = member?.serviceCode
    ? services.find((s) => s.slug === member.serviceCode)
    : undefined

  return (
    <AnimatePresence>
      {member && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Perfil de ${member.name}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl dark:bg-slate-950"
          >
            <div className="relative aspect-[4/3] w-full shrink-0">
              {member.photoUrl && (
                <Image
                  src={member.photoUrl}
                  alt={member.photoAlt || `Fotografía de ${member.name}`}
                  fill
                  sizes="480px"
                  className="object-cover"
                  priority
                />
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar perfil"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md transition-transform hover:scale-105"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col p-8">
              {member.area && (
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {member.area}
                </span>
              )}
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground">{member.name}</h2>
              <p className="mt-1 text-base font-medium text-foreground">{member.position}</p>
              {member.profession && <p className="text-sm text-muted-foreground">{member.profession}</p>}

              {member.bio && (
                <p className="mt-5 whitespace-pre-line text-base text-muted-foreground">{member.bio}</p>
              )}

              {member.certifications && member.certifications.length > 0 && (
                <div className="mt-6 rounded-xl border border-border/40 bg-slate-50 p-4 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Award className="h-4 w-4 text-primary" />
                    {member.certificationsLabel ?? "Certificaciones"}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {member.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.specialties.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-foreground">Especialidades</h3>
                  <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {member.specialties.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {relatedService && (
                <Link
                  href={relatedService.href}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                >
                  Conocer {relatedService.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

interface TeamOrgChartProps {
  members: PublicTeamMember[]
}

export function TeamOrgChart({ members }: TeamOrgChartProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selected, setSelected] = useState<PublicTeamMember | null>(null)

  /** Solo los integrantes con nivel asignado aparecen en el organigrama visual. */
  const chartMembers = useMemo(() => members.filter((m) => m.orgLevel !== null), [members])
  const orgEdges = useMemo(() => buildEdges(chartMembers), [chartMembers])
  const { levels, positions } = useNodePositions(chartMembers)

  const activeIds = useMemo(() => {
    if (!hoveredId) return new Set<string>()
    const ids = new Set<string>([hoveredId])
    orgEdges.forEach((e) => {
      if (e.from === hoveredId) ids.add(e.to)
      if (e.to === hoveredId) ids.add(e.from)
    })
    return ids
  }, [hoveredId, orgEdges])

  const handleEnter = useCallback((id: string) => setHoveredId(id), [])
  const handleLeave = useCallback(() => setHoveredId(null), [])

  if (chartMembers.length === 0) return null

  return (
    <div>
      {/* Desktop / tablet: organigrama con conexiones SVG */}
      <div className="relative hidden lg:block">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {orgEdges.map((edge) => {
            const from = positions.get(edge.from)
            const to = positions.get(edge.to)
            if (!from || !to) return null
            const isActive = hoveredId ? activeIds.has(edge.from) && activeIds.has(edge.to) : false
            return (
              <motion.path
                key={`${edge.from}-${edge.to}`}
                d={buildPath(from, to, edge.curve)}
                fill="none"
                stroke={isActive ? "hsl(var(--primary))" : "#CBD5E1"}
                strokeWidth={isActive ? 0.5 : 0.25}
                strokeDasharray={edge.curve ? "2 1.5" : undefined}
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-300"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            )
          })}
        </svg>

        <div className="relative flex flex-col gap-20 py-6">
          <div className={cn("grid justify-items-center", levelGridCols(levels[1].length))}>
            {levels[1].map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                featured
                active={activeIds.has(m.id)}
                dimmed={hoveredId !== null && !activeIds.has(m.id)}
                onEnter={() => handleEnter(m.id)}
                onLeave={handleLeave}
                onOpen={() => setSelected(m)}
              />
            ))}
          </div>

          <div className={cn("grid justify-items-center gap-4", levelGridCols(levels[2].length))}>
            {levels[2].map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                active={activeIds.has(m.id)}
                dimmed={hoveredId !== null && !activeIds.has(m.id)}
                onEnter={() => handleEnter(m.id)}
                onLeave={handleLeave}
                onOpen={() => setSelected(m)}
              />
            ))}
          </div>

          <div className={cn("grid justify-items-center gap-4", levelGridCols(levels[3].length))}>
            {levels[3].map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                active={activeIds.has(m.id)}
                dimmed={hoveredId !== null && !activeIds.has(m.id)}
                onEnter={() => handleEnter(m.id)}
                onLeave={handleLeave}
                onOpen={() => setSelected(m)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / tablet pequeño: lista vertical limpia */}
      <div className="flex flex-col items-center gap-6 lg:hidden">
        {chartMembers
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((m) => (
            <div key={m.id} className="w-full max-w-xs">
              <MemberCard
                member={m}
                featured={m.orgLevel === 1}
                active={false}
                dimmed={false}
                onEnter={() => {}}
                onLeave={() => {}}
                onOpen={() => setSelected(m)}
              />
            </div>
          ))}
      </div>

      <ProfilePanel member={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
