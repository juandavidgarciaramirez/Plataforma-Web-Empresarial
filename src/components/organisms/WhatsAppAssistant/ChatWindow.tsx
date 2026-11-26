"use client"

import { motion } from "framer-motion"
import { ChatHeader } from "./ChatHeader"
import { ChatMessages } from "./ChatMessages"
import { ChatInput } from "./ChatInput"
import { ServiceSuggestion } from "./ServiceSuggestion"
import { useChatEngine } from "./useChatEngine"

interface ChatWindowProps {
  onClose: () => void
}

/**
 * Panel de conversación de Capi. Reemplaza al antiguo `WhatsAppChatPanel`
 * (que era un formulario disfrazado de chat): ahora es una conversación real
 * con estado, contexto e intención, con la lógica delegada a
 * `useChatEngine` / `src/lib/chatbot/engine.ts`.
 *
 * Tamaño: ~380-420px de ancho y ~600-680px de alto en desktop; casi
 * fullscreen (con margen) en mobile — sección 30 del brief.
 */
export function ChatWindow({ onClose }: ChatWindowProps) {
  const { messages, suggestions, isTyping, sendMessage, resetConversation } = useChatEngine()

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Chat con Yuri, asistente virtual de Capital Consulting"
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-[calc(100dvh-32px)] w-[calc(100vw-16px)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-border/40 bg-white shadow-2xl dark:bg-slate-900 md:h-[min(650px,80vh)] md:w-[380px]"
    >
      <ChatHeader onClose={onClose} onReset={resetConversation} />
      <ChatMessages messages={messages} isTyping={isTyping} />
      <ServiceSuggestion suggestions={suggestions} onSelect={sendMessage} disabled={isTyping} />
      <ChatInput onSend={sendMessage} disabled={isTyping} />
    </motion.div>
  )
}
