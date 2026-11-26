"use client"

import { useEffect, useState } from "react"

/**
 * Revela un texto progresivamente (efecto de escritura) sin sacrificar
 * velocidad: el tiempo total está acotado entre ~180ms y ~450ms sin importar
 * la longitud del texto (sección 14 del brief — mejora la experiencia pero
 * nunca hace esperar al usuario).
 */
export function useTypewriter(text: string, enabled: boolean): string {
  const [shown, setShown] = useState(enabled ? "" : text)

  useEffect(() => {
    if (!enabled) {
      setShown(text)
      return
    }
    let i = 0
    const total = text.length
    const stepMs = Math.max(4, Math.min(18, 400 / Math.max(total, 1)))
    const id = window.setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= total) window.clearInterval(id)
    }, stepMs)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return shown
}
