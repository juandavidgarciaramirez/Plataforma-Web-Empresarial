"use client"

import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

/** Barra de entrada: Enter envía, Shift+Enter agrega línea nueva, autofocus. */
export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSend = () => {
    const trimmed = value.trim()
    // Enter no pasa por el `disabled` del botón: mientras Yuri responde, el texto se conserva sin enviarse.
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  return (
    <div className="border-t border-border/40 bg-white p-3 dark:bg-slate-900">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          rows={1}
          onChange={(event) => {
            setValue(event.target.value)
            const el = event.target
            el.style.height = "auto"
            el.style.height = `${Math.min(el.scrollHeight, 96)}px`
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              handleSend()
            }
          }}
          placeholder="Escribe tu pregunta..."
          aria-label="Escribe tu pregunta para Yuri"
          className="max-h-24 min-h-[40px] flex-1 resize-none rounded-2xl border border-border/50 bg-slate-50 px-4 py-2.5 text-sm leading-tight outline-none focus-visible:ring-2 focus-visible:ring-corporate-blue dark:bg-slate-800"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="Enviar mensaje"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-corporate-blue text-white transition-colors hover:bg-corporate-blue/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
