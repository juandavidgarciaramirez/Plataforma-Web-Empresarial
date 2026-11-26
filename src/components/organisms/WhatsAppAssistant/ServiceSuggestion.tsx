"use client"

import { motion } from "framer-motion"

interface ServiceSuggestionProps {
  suggestions: string[]
  onSelect: (text: string) => void
  disabled?: boolean
}

/**
 * Fila de sugerencias contextuales (máx. 3) sobre el input. Cambian según el
 * tema activo de la conversación — se sienten como ayuda, no como navegación
 * principal (sección 16 del brief).
 */
export function ServiceSuggestion({ suggestions, onSelect, disabled }: ServiceSuggestionProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="flex gap-1 overflow-x-auto px-3 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {suggestions.slice(0, 3).map((label, index) => (
        <motion.button
          key={label}
          type="button"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: index * 0.04 }}
          onClick={() => onSelect(label)}
          disabled={disabled}
          className="shrink-0 whitespace-nowrap rounded-full border border-corporate-blue/25 bg-corporate-blue/5 px-2.5 py-1.5 text-[11px] font-medium text-corporate-blue transition-colors hover:bg-corporate-blue hover:text-white disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200"
        >
          {label}
        </motion.button>
      ))}
    </div>
  )
}
