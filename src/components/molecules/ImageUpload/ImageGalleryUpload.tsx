"use client"

import { useCallback, useState } from "react"
import { useDropzone, type FileRejection } from "react-dropzone"
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, Trash2, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatBytes, mediaService, type ImageFieldValue, type MediaContext } from "@/services/media.service"
import { acceptFor, slotRuleOf, uploadErrorMessage, useMediaRules, validateImageFile } from "./useMediaRules"

interface ImageGalleryUploadProps {
  context: MediaContext
  slot?: string
  label: string
  value: ImageFieldValue[]
  onChange: (value: ImageFieldValue[]) => void
  onBusyChange?: (busy: boolean) => void
  hint?: string
  disabled?: boolean
}

/**
 * Imágenes adicionales de un contenido (galería): varias a la vez, con
 * progreso, texto alternativo por imagen, orden y eliminación. El máximo por
 * sección lo define el backend (`GET /media/rules`).
 */
export function ImageGalleryUpload({
  context,
  slot = "gallery",
  label,
  value,
  onChange,
  onBusyChange,
  hint,
  disabled,
}: ImageGalleryUploadProps) {
  const { data: rules } = useMediaRules()
  const max = slotRuleOf(rules, context, slot)?.max ?? 12
  const [progress, setProgress] = useState<{ current: number; total: number; percent: number } | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [notices, setNotices] = useState<string[]>([])

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const room = max - value.length
      const problems: string[] = []
      if (files.length > room) problems.push(`Solo puedes agregar ${room} imagen(es) más (máximo ${max}).`)
      const candidates = files.slice(0, Math.max(room, 0)).filter((file) => {
        const invalid = validateImageFile(file, rules)
        if (invalid) problems.push(invalid)
        return !invalid
      })
      setErrors(problems)
      setNotices([])
      if (candidates.length === 0) return

      onBusyChange?.(true)
      const added: ImageFieldValue[] = []
      const warnings: string[] = []
      for (const [index, file] of candidates.entries()) {
        setProgress({ current: index + 1, total: candidates.length, percent: 0 })
        try {
          const uploaded = await mediaService.uploadImage(file, context, slot, (percent) =>
            setProgress({ current: index + 1, total: candidates.length, percent }),
          )
          added.push({
            fileId: uploaded.fileId,
            url: uploaded.url,
            alt: "",
            originalName: uploaded.originalName,
            sizeBytes: uploaded.sizeBytes,
            width: uploaded.width,
            height: uploaded.height,
          })
          warnings.push(...uploaded.warnings.map((w) => `${uploaded.originalName}: ${w}`))
        } catch (err) {
          problems.push(`${file.name}: ${uploadErrorMessage(err)}`)
        }
      }
      setProgress(null)
      onBusyChange?.(false)
      setErrors([...problems])
      if (added.length > 0) {
        onChange([...value, ...added])
        setNotices([`${added.length} imagen(es) cargada(s). Se publicarán al guardar.`, ...warnings])
      }
    },
    [max, value, rules, context, slot, onChange, onBusyChange],
  )

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => void uploadFiles([...accepted, ...rejections.map((r) => r.file)]),
    [uploadFiles],
  )

  const full = value.length >= max
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptFor(rules),
    multiple: true,
    disabled: disabled || full || progress !== null || rules?.uploadsEnabled === false,
  })

  const move = (index: number, delta: number) => {
    const next = [...value]
    const [item] = next.splice(index, 1)
    next.splice(index + delta, 0, item)
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-slate-500">
          {value.length} / {max}
        </span>
      </div>

      {value.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((image, index) => (
            <li key={image.fileId ?? image.url} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="relative aspect-[4/3] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- vista previa del backend, sin optimizar */}
                <img src={image.url} alt={image.alt || `Imagen ${index + 1}`} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="space-y-2 p-2">
                <p className="truncate text-xs text-slate-500" title={image.originalName}>
                  {image.originalName} {image.sizeBytes ? `· ${formatBytes(image.sizeBytes)}` : ""}
                </p>
                <Input
                  value={image.alt}
                  maxLength={300}
                  placeholder="Texto alternativo"
                  aria-label={`Texto alternativo de la imagen ${index + 1}`}
                  onChange={(e) => onChange(value.map((item, i) => (i === index ? { ...item, alt: e.target.value } : item)))}
                  disabled={disabled}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={disabled || index === 0}
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      aria-label="Mover a la izquierda"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={disabled || index === value.length - 1}
                      className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      aria-label="Mover a la derecha"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, i) => i !== index))}
                    disabled={disabled}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Quitar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!full && (
        <div
          {...getRootProps()}
          className={cn(
            "cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center text-sm text-slate-500 transition-colors hover:border-blue-400",
            isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-200",
          )}
        >
          <input {...getInputProps()} aria-label={`Agregar ${label.toLowerCase()}`} />
          {progress ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span>
                Subiendo {progress.current} de {progress.total}… {progress.percent}%
              </span>
              <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <UploadCloud className="h-6 w-6 text-slate-400" />
              <p>
                Arrastra imágenes o <span className="font-medium text-blue-600">haz clic para agregarlas</span>
              </p>
            </div>
          )}
        </div>
      )}

      {errors.map((error) => (
        <p key={error} role="alert" className="flex items-start gap-1.5 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      ))}
      {notices.map((notice, index) => (
        <p key={notice} className={cn("flex items-start gap-1.5 text-sm", index === 0 ? "text-emerald-600" : "text-amber-700")}>
          {index === 0 ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          {notice}
        </p>
      ))}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
