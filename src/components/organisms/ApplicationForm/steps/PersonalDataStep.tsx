"use client"

import { Controller, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DOCUMENT_TYPES } from "@/features/careers/careers.constants"
import type { CreateApplicationDto } from "@/features/careers/dto/create-application.dto"

/** Datos personales — campos 1 a 6 del brief. */
export function PersonalDataStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateApplicationDto>()

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="nombreCompleto">
          Nombres y apellidos completos <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nombreCompleto"
          {...register("nombreCompleto")}
          placeholder="Tu nombre completo"
          aria-invalid={!!errors.nombreCompleto}
        />
        {errors.nombreCompleto && <p className="mt-1 text-sm text-destructive">{errors.nombreCompleto.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="tipoDocumento">
            Tipo de documento de identidad <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="tipoDocumento"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="tipoDocumento" aria-invalid={!!errors.tipoDocumento}>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.tipoDocumento && <p className="mt-1 text-sm text-destructive">{errors.tipoDocumento.message}</p>}
        </div>

        <div>
          <Label htmlFor="numeroDocumento">
            Número de documento de identidad <span className="text-destructive">*</span>
          </Label>
          <Input
            id="numeroDocumento"
            {...register("numeroDocumento")}
            placeholder="Ej. 1020304050"
            aria-invalid={!!errors.numeroDocumento}
          />
          {errors.numeroDocumento && <p className="mt-1 text-sm text-destructive">{errors.numeroDocumento.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="celular">
            Número de celular <span className="text-destructive">*</span>
          </Label>
          <Input
            id="celular"
            {...register("celular")}
            placeholder="+57 300 123 4567"
            aria-invalid={!!errors.celular}
          />
          {errors.celular && <p className="mt-1 text-sm text-destructive">{errors.celular.message}</p>}
        </div>

        <div>
          <Label htmlFor="correo">
            Correo electrónico <span className="text-destructive">*</span>
          </Label>
          <Input
            id="correo"
            type="email"
            {...register("correo")}
            placeholder="correo@ejemplo.com"
            aria-invalid={!!errors.correo}
          />
          {errors.correo && <p className="mt-1 text-sm text-destructive">{errors.correo.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="ciudadPais">
          Ciudad y país de residencia <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ciudadPais"
          {...register("ciudadPais")}
          placeholder="Ej. Bogotá, Colombia"
          aria-invalid={!!errors.ciudadPais}
        />
        {errors.ciudadPais && <p className="mt-1 text-sm text-destructive">{errors.ciudadPais.message}</p>}
      </div>
    </div>
  )
}
