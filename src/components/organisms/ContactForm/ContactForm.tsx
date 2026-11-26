"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useCreateContact } from "@/hooks/useContact"
import { ApiRequestError } from "@/lib/api/client"
import { createContactDto, type CreateContactDto } from "@/features/contact/dto/create-contact.dto"
import { services } from "@/data/services"
import { LEGAL_ROUTES } from "@/config/legal"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { mutate, isPending } = useCreateContact()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateContactDto>({
    resolver: zodResolver(createContactDto),
  })

  const onSubmit = (data: CreateContactDto) => {
    setServerError(null)
    mutate(data, {
      onSuccess: () => {
        setSubmitted(true)
        reset()
      },
      onError: (err) => {
        setServerError(err instanceof ApiRequestError ? err.message : "No fue posible enviar tu solicitud.")
      },
    })
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
          Solicitud recibida correctamente
        </h3>
        <p className="mt-2 text-muted-foreground">
          Un asesor de Capital Consulting se pondrá en contacto contigo muy pronto.
        </p>
        <div className="mt-6">
          <Button type="button" variant="outline" onClick={() => setSubmitted(false)}>
            Enviar otra solicitud
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {serverError && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="nombre">
            Nombre <span className="text-destructive">*</span>
          </Label>
          <Input id="nombre" {...register("nombre")} placeholder="Tu nombre" aria-invalid={!!errors.nombre} />
          {errors.nombre && <p className="mt-1 text-sm text-destructive">{errors.nombre.message}</p>}
        </div>
        <div>
          <Label htmlFor="empresa">Empresa</Label>
          <Input id="empresa" {...register("empresa")} placeholder="Nombre de la empresa" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="correo">
            Correo <span className="text-destructive">*</span>
          </Label>
          <Input id="correo" type="email" {...register("correo")} placeholder="correo@empresa.com" aria-invalid={!!errors.correo} />
          {errors.correo && <p className="mt-1 text-sm text-destructive">{errors.correo.message}</p>}
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" {...register("telefono")} placeholder="+57 300 123 4567" aria-invalid={!!errors.telefono} />
          {errors.telefono && <p className="mt-1 text-sm text-destructive">{errors.telefono.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="servicioInteres">
          Servicio de interés <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="servicioInteres"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="servicioInteres" aria-invalid={!!errors.servicioInteres}>
                <SelectValue placeholder="Selecciona un servicio..." />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.slug} value={service.slug}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.servicioInteres && <p className="mt-1 text-sm text-destructive">{errors.servicioInteres.message}</p>}
      </div>

      <div>
        <Label htmlFor="mensaje">
          Mensaje <span className="text-destructive">*</span>
        </Label>
        <Textarea id="mensaje" {...register("mensaje")} rows={5} placeholder="Cuéntanos sobre tu próximo desafío" aria-invalid={!!errors.mensaje} />
        {errors.mensaje && <p className="mt-1 text-sm text-destructive">{errors.mensaje.message}</p>}
      </div>

      <Button type="submit" variant="corporate" size="full" loading={isPending}>
        Solicitar asesoría
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Al enviar este formulario aceptas nuestra{" "}
        <Link href={LEGAL_ROUTES.dataPolicyUrl} className="font-medium text-primary hover:underline">
          Política de Tratamiento de Datos
        </Link>{" "}
        y puedes consultar nuestra{" "}
        <Link href={LEGAL_ROUTES.privacyUrl} className="font-medium text-primary hover:underline">
          Política de Privacidad
        </Link>
        .
      </p>
    </form>
  )
}
