"use client"

import { useCallback, useEffect, useState } from "react"
import { useDropzone, type FileRejection } from "react-dropzone"
import { AlertCircle, CheckCircle2, ImageIcon, Loader2, RefreshCw, Trash2, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatBytes, mediaService, type ImageFieldValue, type MediaContext } from "@/services/media.service"
import { acceptFor, slotRuleOf, uploadErrorMessage, useMediaRules, validateImageFile } from "./useMediaRules"

interface ImageUploadProps {
  context: MediaContext
  slot: string
  label: string
  value: ImageFieldValue | null
  onChange: (value: ImageFieldValue | null) => void
  /** Notifica si hay una carga en curso (para deshabilitar "Guardar" mientras tanto). */
  onBusyChange?: (busy: boolean) => void
  /** Proporción de la vista previa, p. ej. "aspect-[16/9]" o "aspect-[4/5]". */
  previewAspect?: string
  hint?: string
  disabled?: boolean
}

/**
 * Campo de imagen principal del panel (Etapa 15): seleccionar o arrastrar,
 * vista previa inmediata, progreso real de la carga, nombre y tamaño,
 * reemplazar, quitar y texto alternativo. La imagen se sube al elegirla
 * (POST /media/images) y queda asociada al contenido al pulsar "Guardar".
 */
export function ImageUpload({
  context,
  slot,
  label,
  value,
  onChange,
  onBusyChange,
  previewAspect = "aspect-[16/9]",
  hint,
  disabled,
}: ImageUploadProps) {
  const { data: rules } = useMediaRules()
  const rule = slotRuleOf(rules, context, slot)
  const [progress, setProgress] = useState<number | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ text: string; warnings: string[] } | null>(null)

  useEffect(() => () => {
    if (localPreview) URL.revokeObjectURL(localPreview)
  }, [localPreview])

  const uploading = progress !== null

  const upload = useCallback(
    async (file: File) => {
      const invalid = validateImageFile(file, rules)
      if (invalid) {
        setError(invalid)
        setNotice(null)
        return
      }
      setError(null)
      setNotice(null)
      setLocalPreview(URL.createObjectURL(file))
      setProgress(0)
      onBusyChange?.(true)
      try {
        const uploaded = await mediaService.uploadImage(file, context, slot, setProgress)
        onChange({
          fileId: uploaded.fileId,
          url: uploaded.url,
          alt: value?.alt ?? "",
          originalName: uploaded.originalName,
          sizeBytes: uploaded.sizeBytes,
          width: uploaded.width,
          height: uploaded.height,
        })
        setNotice({ text: "Imagen cargada. Se publicará al guardar.", warnings: uploaded.warnings })
      } catch (err) {
        setError(uploadErrorMessage(err))
      } finally {
        setLocalPreview(null)
        setProgress(null)
        onBusyChange?.(false)
      }
    },
    [context, slot, rules, value?.alt, onChange, onBusyChange],
  )

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      const file = accepted[0] ?? rejections[0]?.file
      if (file) void upload(file)
    },
    [upload],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: acceptFor(rules),
    multiple: false,
    noClick: Boolean(value),
    noKeyboard: Boolean(value),
    disabled: disabled || uploading || rules?.uploadsEnabled === false,
  })

  const previewUrl = localPreview ?? value?.url ?? null
  const recommended = rule ? `Recomendado: ${rule.recommendedWidth}×${rule.recommendedHeight} px` : null
  const formats = rules ? rules.allowedExtensions.filter((e) => e !== "jpeg").join(", ").toUpperCase() : "JPG, PNG, WEBP"
  const maxMb = rules ? `${Math.round(rules.maxSizeBytes / (1024 * 1024))} MB` : ""

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {rules?.uploadsEnabled === false && (
        <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {rules.unavailableReason}
        </p>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed transition-colors",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-200",
          !value && !uploading && "cursor-pointer hover:border-blue-400",
          error && "border-red-300",
        )}
      >
        <input {...getInputProps()} aria-label={`Seleccionar ${label.toLowerCase()}`} />

        {previewUrl ? (
          <div className={cn("relative w-full bg-slate-100", previewAspect)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) o del backend, sin optimizar */}
            <img src={previewUrl} alt={value?.alt || "Vista previa"} className="absolute inset-0 h-full w-full object-cover" />
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/50 text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm font-medium">Subiendo… {progress}%</span>
                <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-white/30">
                  <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-slate-500">
            <UploadCloud className="h-7 w-7 text-slate-400" />
            <p>
              Arrastra una imagen o <span className="font-medium text-blue-600">haz clic para seleccionarla</span>
            </p>
            <p className="text-xs">
              {formats}
              {maxMb && ` · máx. ${maxMb}`}
              {recommended && ` · ${recommended}`}
            </p>
          </div>
        )}
      </div>

      {value && !uploading && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
          <span className="flex min-w-0 items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{value.originalName ?? value.url.split("/").pop()}</span>
          </span>
          {value.sizeBytes ? <span>{formatBytes(value.sizeBytes)}</span> : null}
          {value.width && value.height ? (
            <span>
              {value.width}×{value.height} px
            </span>
          ) : null}
          <div className="ml-auto flex gap-1">
            <button
              type="button"
              onClick={open}
              disabled={disabled}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reemplazar
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(null)
                setNotice(null)
                setError(null)
              }}
              disabled={disabled}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Quitar
            </button>
          </div>
        </div>
      )}

      {value && (
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Texto alternativo (accesibilidad y SEO)</Label>
          <Input
            value={value.alt}
            maxLength={300}
            placeholder="Describe brevemente lo que muestra la imagen"
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            disabled={disabled}
          />
        </div>
      )}

      {error && (
        <p role="alert" className="flex items-start gap-1.5 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
      {notice && !error && (
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {notice.text}
          </p>
          {notice.warnings.map((warning) => (
            <p key={warning} className="flex items-start gap-1.5 text-amber-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {warning}
            </p>
          ))}
        </div>
      )}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
