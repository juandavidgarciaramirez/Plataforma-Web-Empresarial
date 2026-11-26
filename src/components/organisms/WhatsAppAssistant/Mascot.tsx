"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils/cn"

interface MascotProps {
  className?: string
  size?: number
}

/**
 * "Capi", la mascota corporativa de Capital Consulting (águila con headset y
 * chaleco de marca) — imagen provista por el cliente en
 * `public/images/asistente-whatsapp/capi.png`. Se anima como conjunto
 * (flotación + balanceo + respiración) porque es un raster, no un vector
 * descomponible por partes.
 */
export function Mascot({ className, size = 56 }: MascotProps) {
  return (
    <motion.div
      className={cn("relative shrink-0 overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
      animate={{ y: [0, -4, 0, -4, 0], rotate: [0, -3, 0, 3, 0], scale: [1, 1.04, 1, 1.04, 1] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image
        src="/images/asistente-whatsapp/capi.png"
        alt="Yuri, asistente virtual de Capital Consulting"
        fill
        sizes={`${size}px`}
        className="object-cover object-top"
        priority
      />
    </motion.div>
  )
}
