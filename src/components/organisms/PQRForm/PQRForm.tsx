"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/atoms/Button"
import { LEGAL_ROUTES } from "@/config/legal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/molecules/FileUpload/FileUpload"
import { useCreatePqr } from "@/hooks/usePQR"
import { ApiRequestError } from "@/lib/api/client"
import { PQR_ATTACHMENT_RULE } from "@/lib/api/file-validation"
import {
  createPqrDto,
  type CreatePqrDto,
  TIPOS_SOLICITUD_PQR,
  TIPOS_SOLICITUD_PQR_LABELS,
  TIPOS_DOCUMENTO,
  TIPOS_DOCUMENTO_LABELS,
} from "@/features/pqr/dto/create-pqr.dto"

export function PQRForm() {
  const [file, setFile] = useState<File | null>(null)
  const [radicado, setRadicado] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const { mutate, isPending } = useCreatePqr()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreatePqrDto>({
    resolver: zodResolver(createPqrDto),
    defaultValues: { consentimiento: false },
  })

  const status: "idle" | "loading" | "success" | "error" = isPending
    ? "loading"
    : radicado
      ? "success"
      : serverError
        ? "error"
        : "idle"

  const onSubmit = (data: CreatePqrDto) => {
    setServerError(null)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      formData.append(key, String(value))
    })
    if (file) formData.append("archivo", file)

    mutate(formData, {
      onSuccess: (result) => {
        setRadicado(result.radicado)
        reset({ consentimiento: false })
        setFile(null)
      },
      onError: (err) => {
        setServerError(err instanceof ApiRequestError ? err.message : "No fue posible enviar tu solicitud.")
      },
    })
  }

  if (status === "success" && radicado) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
          Solicitud recibida correctamente
        </h3>
        <p className="mt-2 text-muted-foreground">
          Hemos registrado tu PQR y será atendida por nuestro equipo.
        </p>
        <p className="mt-4 inline-block rounded-full bg-white px-5 py-2 font-mono text-sm font-semibold text-primary shadow-sm dark:bg-slate-900">
          Número de radicado: {radicado}
        </p>
        <div className="mt-6">
          <Button type="button" variant="outline" onClick={() => setRadicado(null)}>
            Enviar otra solicitud
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {status === "error" && serverError && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="nombreCompleto">
            Nombre completo <span className="text-destructive">*</span>
          </Label>
          <Input id="nombreCompleto" {...register("nombreCompleto")} placeholder="Tu nombre completo" aria-invalid={!!errors.nombreCompleto} />
          {errors.nombreCompleto && <p className="mt-1 text-sm text-destructive">{errors.nombreCompleto.message}</p>}
        </div>
        <div>
          <Label htmlFor="correo">
            Correo electrónico <span className="text-destructive">*</span>
          </Label>
          <Input id="correo" type="email" {...register("correo")} placeholder="correo@empresa.com" aria-invalid={!!errors.correo} />
          {errors.correo && <p className="mt-1 text-sm text-destructive">{errors.correo.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="tipoDocumento">Tipo de documento</Label>
          <Controller
            control={control}
            name="tipoDocumento"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="tipoDocumento">
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_DOCUMENTO.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {TIPOS_DOCUMENTO_LABELS[tipo]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label htmlFor="numeroDocumento">Número de documento</Label>
          <Input id="numeroDocumento" {...register("numeroDocumento")} placeholder="Número de documento" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" {...register("telefono")} placeholder="+57 300 123 4567" aria-invalid={!!errors.telefono} />
          {errors.telefono && <p className="mt-1 text-sm text-destructive">{errors.telefono.message}</p>}
        </div>
        <div>
          <Label htmlFor="empresa">Empresa</Label>
          <Input id="empresa" {...register("empresa")} placeholder="Nombre de la empresa" />
        </div>
      </div>

      <div>
        <Label htmlFor="tipoSolicitud">
          Tipo de solicitud <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="tipoSolicitud"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="tipoSolicitud" aria-invalid={!!errors.tipoSolicitud}>
                <SelectValue placeholder="Selecciona un tipo..." />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_SOLICITUD_PQR.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {TIPOS_SOLICITUD_PQR_LABELS[tipo]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.tipoSolicitud && <p className="mt-1 text-sm text-destructive">{errors.tipoSolicitud.message}</p>}
      </div>

      <div>
        <Label htmlFor="asunto">
          Asunto <span className="text-destructive">*</span>
        </Label>
        <Input id="asunto" {...register("asunto")} placeholder="Resumen breve de tu solicitud" aria-invalid={!!errors.asunto} />
        {errors.asunto && <p className="mt-1 text-sm text-destructive">{errors.asunto.message}</p>}
      </div>

      <div>
        <Label htmlFor="descripcion">
          Descripción <span className="text-destructive">*</span>
        </Label>
        <Textarea id="descripcion" {...register("descripcion")} rows={5} placeholder="Cuéntanos con detalle tu solicitud" aria-invalid={!!errors.descripcion} />
        {errors.descripcion && <p className="mt-1 text-sm text-destructive">{errors.descripcion.message}</p>}
      </div>

      <div>
        <Label htmlFor="archivo">Archivo adjunto</Label>
        <FileUpload
          id="archivo"
          rule={PQR_ATTACHMENT_RULE}
          accept={{ "application/pdf": [".pdf"], "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
          value={file}
          onChange={setFile}
          hint="PDF, JPG o PNG · máx. 5MB"
        />
      </div>

      <div className="flex items-start space-x-2">
        <Controller
          control={control}
          name="consentimiento"
          render={({ field }) => (
            <Checkbox
              id="consentimiento"
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={!!errors.consentimiento}
            />
          )}
        />
        <Label htmlFor="consentimiento" className="text-sm font-normal leading-snug">
          Autorizo el tratamiento de mis datos personales de acuerdo con la política de privacidad de Capital
          Consulting.
        </Label>
      </div>
      {errors.consentimiento && <p className="text-sm text-destructive">{errors.consentimiento.message}</p>}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Consulta nuestra{" "}
        <Link href={LEGAL_ROUTES.dataPolicyUrl} className="font-medium text-primary hover:underline">
          Política de Tratamiento de Datos
        </Link>{" "}
        y nuestra{" "}
        <Link href={LEGAL_ROUTES.privacyUrl} className="font-medium text-primary hover:underline">
          Política de Privacidad
        </Link>
        .
      </p>

      <Button type="submit" variant="corporate" size="full" loading={status === "loading"}>
        Enviar solicitud
      </Button>
    </form>
  )
}
