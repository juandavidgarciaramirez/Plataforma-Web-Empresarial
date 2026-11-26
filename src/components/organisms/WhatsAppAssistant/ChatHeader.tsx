"use client"

import { RotateCcw, X } from "lucide-react"
import { Mascot } from "./Mascot"
import { ASSISTANT } from "@/config/chatbot"

interface ChatHeaderProps {
  onClose: () => void
  onReset: () => void
}

/** Encabezado del panel: identidad de Capi + estado "En línea" + reinicio discreto. */
export function ChatHeader({ onClose, onReset }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 bg-corporate-dark px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <Mascot size={40} />
        <div>
          <p className="font-display text-sm font-semibold leading-tight">{ASSISTANT.name}</p>
          <p className="text-xs leading-tight text-white/70">
            {ASSISTANT.role} · {ASSISTANT.company}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/60">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#25D366]" />
            </span>
            {ASSISTANT.status}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onReset}
          aria-label="Reiniciar conversación"
          title="Reiniciar conversación"
          className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar chat del asistente"
          className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
