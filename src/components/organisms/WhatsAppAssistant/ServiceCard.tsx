"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface ServiceCardProps {
  service: { id: string; name: string; tagline: string; href: string }
}

/** Tarjeta compacta que Capi muestra cuando identifica un servicio relevante. */
export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} className="w-fit max-w-[85%]">
      <Link
        href={service.href}
        className="group flex flex-col gap-1 rounded-xl border border-corporate-blue/20 bg-white px-4 py-3 shadow-sm transition-colors hover:border-corporate-blue/40 dark:bg-slate-800"
      >
        <p className="font-display text-sm font-semibold text-corporate-dark dark:text-white">{service.name}</p>
        <p className="text-xs text-muted-foreground">{service.tagline}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-corporate-blue">
          Conoce la solución
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  )
}
