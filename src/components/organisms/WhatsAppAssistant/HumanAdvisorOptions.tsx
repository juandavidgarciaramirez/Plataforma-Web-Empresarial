"use client"

import { MessageCircle, Mail } from "lucide-react"

interface HumanAdvisorOptionsProps {
  whatsappUrl: string
  mailUrl: string
}

/** Par de botones de escalamiento a humano: WhatsApp o correo (sección 17-19 del brief). */
export function HumanAdvisorOptions({ whatsappUrl, mailUrl }: HumanAdvisorOptionsProps) {
  return (
    <div className="flex w-fit max-w-[85%] flex-col gap-2">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
      >
        <MessageCircle className="h-3.5 w-3.5" fill="currentColor" />
        WhatsApp
      </a>
      <a
        href={mailUrl}
        className="inline-flex items-center gap-2 rounded-full border border-corporate-blue/30 bg-white px-4 py-2 text-xs font-semibold text-corporate-blue shadow-sm transition-colors hover:bg-corporate-blue hover:text-white dark:bg-slate-800"
      >
        <Mail className="h-3.5 w-3.5" />
        Correo electrónico
      </a>
    </div>
  )
}
