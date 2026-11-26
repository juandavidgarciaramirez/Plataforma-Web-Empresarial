"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useDropzone, type Accept, type FileRejection } from "react-dropzone"
import { UploadCloud, FileText, X, RefreshCw, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { validateUploadedFile, type FileValidationRule } from "@/lib/api/file-validation"

interface FileUploadProps {
  id?: string
  /** Regla compartida con el backend (`PQR_ATTACHMENT_RULE` / `RESUME_RULE`). */
  rule: FileValidationRule
  /** Mapa de `accept` para react-dropzone, p. ej. `{ "application/pdf": [".pdf"] }`. */
  accept: Accept
  value: File | null
  onChange: (file: File | null) => void
  hint?: string
  /** Error externo (p. ej. "campo obligatorio") a mostrar además de la validación propia. */
  error?: string
  disabled?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export function FileUpload({ id, rule, accept, value, onChange, hint, error, disabled }: FileUploadProps) {
  const [localError, setLocalError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current)
    }
  }, [])

  const acceptFile = useCallback(
    (file: File) => {
      setLocalError(null)
      onChange(file)

      // Feedback visual de carga (sección 4: "barra de carga"). El envío real
      // es un único `fetch` con FormData sin evento de progreso del navegador,
      // así que esto simula la confirmación de que el archivo quedó listo.
      if (progressTimer.current) clearInterval(progressTimer.current)
      setUploadProgress(0)
      progressTimer.current = setInterval(() => {
        setUploadProgress((current) => {
          if (current === null) return null
          const next = current + 20
          if (next >= 100) {
            if (progressTimer.current) clearInterval(progressTimer.current)
            setTimeout(() => setUploadProgress(null), 300)
            return 100
          }
          return next
        })
      }, 70)
    },
    [onChange]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        setLocalError("Formato o tamaño de archivo no permitido.")
        return
      }

      const file = acceptedFiles[0]
      if (!file) return

      const result = validateUploadedFile(file, rule)
      if (result.valid === false) {
        setLocalError(result.error)
        onChange(null)
        return
      }

      acceptFile(file)
    },
    [acceptFile, onChange, rule]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: rule.maxSizeBytes,
    maxFiles: 1,
    multiple: false,
    disabled,
  })

  const displayError = error || localError
  const isUploading = uploadProgress !== null

  return (
    <div>
      <div
        {...getRootProps()}
        id={id}
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary",
          disabled && "cursor-not-allowed opacity-50",
          displayError && "border-destructive"
        )}
      >
        <input {...getInputProps()} aria-label="Adjuntar archivo" />
        {value ? (
          <div className="text-left">
            <div className="flex items-center gap-3 text-sm">
              <FileText className="h-8 w-8 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{value.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(value.size)}</p>
              </div>
              <button
                type="button"
                aria-label="Quitar archivo"
                onClick={(event) => {
                  event.stopPropagation()
                  onChange(null)
                  setLocalError(null)
                  setUploadProgress(null)
                }}
                className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isUploading ? (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            ) : (
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                <RefreshCw className="h-3 w-3" />
                Arrastra o haz clic para reemplazar el archivo
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <UploadCloud className="h-6 w-6" />
            <p>
              Arrastra tu archivo aquí o <span className="font-medium text-primary">haz clic para seleccionar</span>
            </p>
            {hint && <p className="text-xs">{hint}</p>}
          </div>
        )}
      </div>
      {displayError && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {displayError}
        </p>
      )}
    </div>
  )
}
