"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { ChatMessage } from "./ChatMessage"
import { TypingIndicator } from "./TypingIndicator"
import type { ChatMessage as ChatMessageData } from "./useChatEngine"

interface ChatMessagesProps {
  messages: ChatMessageData[]
  isTyping: boolean
}

/** Zona de conversación con auto-scroll al último mensaje. */
export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, isTyping])

  return (
    <div className="flex-1 space-y-2.5 overflow-y-auto bg-slate-100 p-4 dark:bg-slate-950/40">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <AnimatePresence>
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-6 shrink-0" />
            <TypingIndicator />
          </div>
        )}
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  )
}
