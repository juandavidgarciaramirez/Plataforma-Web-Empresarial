"use client"

import { Controller, useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { SectorSelector } from "@/components/molecules/SectorSelector/SectorSelector"
import type { CreateApplicationDto } from "@/features/careers/dto/create-application.dto"

/** Sector de experiencia — selección múltiple (sección 4, bloque "Sector de experiencia"). */
export function SectorStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateApplicationDto>()

  return (
    <div>
      <Label htmlFor="sectores">
        Selecciona el sector donde tienes experiencia <span className="text-destructive">*</span>
      </Label>
      <p className="mt-1 text-sm text-muted-foreground">Puedes seleccionar más de uno.</p>

      <div className="mt-4">
        <Controller
          control={control}
          name="sectores"
          render={({ field }) => (
            <SectorSelector id="sectores" value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </div>
      {errors.sectores && <p className="mt-3 text-sm text-destructive">{errors.sectores.message}</p>}
    </div>
  )
}
