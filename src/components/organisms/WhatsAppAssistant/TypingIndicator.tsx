"use client"

import { motion } from "framer-motion"

/** Burbuja "Yuri está escribiendo" — tres puntos con rebote escalonado. */
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 shadow-sm dark:bg-slate-800"
      aria-label="Yuri está escribiendo"
    >
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-1.5 w-1.5 rounded-full bg-corporate-blue/60 dark:bg-slate-400"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  )
}
