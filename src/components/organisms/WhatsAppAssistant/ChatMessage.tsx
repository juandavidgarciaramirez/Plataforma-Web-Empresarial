"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Mascot } from "./Mascot"
import { ServiceCard } from "./ServiceCard"
import { HumanAdvisorOptions } from "./HumanAdvisorOptions"
import { useTypewriter } from "./useTypewriter"
import type { ChatMessage as ChatMessageData } from "./useChatEngine"

interface ChatMessageProps {
  message: ChatMessageData
}

function TextBubble({ text, role, fresh }: { text: string; role: "user" | "assistant"; fresh: boolean }) {
  const revealed = useTypewriter(text, fresh && role === "assistant")
  const isUser = role === "user"
  return (
    <div
      className={
        isUser
          ? "max-w-[85%] rounded-2xl rounded-br-sm bg-corporate-blue px-3.5 py-2.5 text-sm text-white shadow-sm"
          : "max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm dark:bg-slate-800 dark:text-slate-100"
      }
    >
      {revealed}
    </div>
  )
}

/** Un mensaje de la conversación: bloque de texto, tarjeta de servicio, opciones de asesor o link de ruta. */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const fresh = message.fresh ?? false

  const content = (() => {
    switch (message.block.type) {
      case "text":
        return <TextBubble text={message.block.text} role={message.role} fresh={fresh} />
      case "card":
        return <ServiceCard service={message.block.service} />
      case "advisor":
        return <HumanAdvisorOptions whatsappUrl={message.block.whatsappUrl} mailUrl={message.block.mailUrl} />
      case "link":
        return (
          <Link
            href={message.block.href}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-corporate-blue/30 bg-white px-4 py-2 text-xs font-semibold text-corporate-blue shadow-sm transition-colors hover:bg-corporate-blue hover:text-white dark:bg-slate-800"
          >
            {message.block.label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )
      default:
        return null
    }
  })()

  return (
    <motion.div
      initial={fresh ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-6 shrink-0">{message.withMascot && <Mascot size={24} />}</div>
      )}
      {content}
    </motion.div>
  )
}
