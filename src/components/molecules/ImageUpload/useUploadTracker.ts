"use client"

import { useCallback, useState } from "react"

/** Cuenta las cargas de imágenes en curso de un formulario, para no guardar a mitad de una subida. */
export function useUploadTracker() {
  const [pending, setPending] = useState(0)
  const onBusyChange = useCallback((busy: boolean) => setPending((count) => Math.max(0, count + (busy ? 1 : -1))), [])
  return { uploading: pending > 0, onBusyChange }
}
