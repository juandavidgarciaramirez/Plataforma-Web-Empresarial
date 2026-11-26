"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, MessageCircle } from "lucide-react"
import { Mascot } from "./Mascot"
import { ChatWindow } from "./ChatWindow"

type BubbleStage = "hidden" | "tooltip"

/**
 * Asistente flotante global de Capital Consulting ("Capi"). Se monta una
 * sola vez desde `src/app/(public)/layout.tsx` y aparece en todas las
 * páginas públicas. Comportamiento inspirado conceptualmente en
 * https://todotintasysuministros.com/ (solo como referencia de
 * comportamiento/interacción, sin reutilizar su diseño ni su personaje).
 *
 * Posición: lado derecho de la pantalla, por indicación explícita del
 * cliente (el rediseño del chatbot volvió a pedir lado izquierdo, pero se
 * confirmó con el cliente mantener la derecha — ver decisión registrada en
 * esta conversación).
 */
export function WhatsAppAssistant() {
  const [bubbleStage, setBubbleStage] = useState<BubbleStage>("hidden")
  const [bubbleClosed, setBubbleClosed] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setBubbleStage("tooltip"), 1200)
    return () => clearTimeout(showTimer)
  }, [])

  const bubbleVisible = bubbleStage !== "hidden" && !bubbleClosed && !panelOpen

  return (
    <div className="fixed bottom-[18px] right-[12px] z-[60] flex flex-col items-end gap-3 md:bottom-[25px] md:right-5">
      <AnimatePresence>
        {panelOpen && (
          <div className="mb-1">
            <ChatWindow onClose={() => setPanelOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bubbleVisible && !panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex max-w-[220px] items-center gap-2 rounded-2xl rounded-br-sm border border-border/40 bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-lg dark:bg-slate-900"
          >
            <span>¿Necesitas ayuda? 👋</span>
            <button
              type="button"
              aria-label="Cerrar mensaje del asistente"
              onClick={() => setBubbleClosed(true)}
              className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!panelOpen && (
        <motion.button
          type="button"
          onClick={() => {
            setPanelOpen(true)
            setBubbleClosed(true)
          }}
          aria-label="Abrir a Yuri, el asistente virtual de Capital Consulting"
          aria-haspopup="dialog"
          aria-expanded={panelOpen}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:bg-slate-900"
        >
          <Mascot size={48} />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white ring-2 ring-white dark:ring-slate-900">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-60" />
            <MessageCircle className="relative h-3.5 w-3.5" fill="currentColor" />
          </span>
        </motion.button>
      )}
    </div>
  )
}
