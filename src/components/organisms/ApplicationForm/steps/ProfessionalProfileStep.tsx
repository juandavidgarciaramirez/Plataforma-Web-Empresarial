"use client"

import { Controller, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils/cn"
import {
  EDUCATION_LEVELS,
  EXPERIENCE_RANGES,
  RELOCATION_OPTIONS,
  REFERRAL_SOURCES,
} from "@/features/careers/careers.constants"
import type { CreateApplicationDto } from "@/features/careers/dto/create-application.dto"

/** Perfil profesional — campos 7 a 13 del brief. */
export function ProfessionalProfileStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateApplicationDto>()

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="cargoAspirado">
          Cargo al que desea postularse <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cargoAspirado"
          {...register("cargoAspirado")}
          placeholder="Ej. Analista de Talento Humano"
          aria-invalid={!!errors.cargoAspirado}
        />
        {errors.cargoAspirado && <p className="mt-1 text-sm text-destructive">{errors.cargoAspirado.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="aniosExperiencia">
            Años de experiencia en el cargo <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="aniosExperiencia"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="aniosExperiencia" aria-invalid={!!errors.aniosExperiencia}>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.aniosExperiencia && (
            <p className="mt-1 text-sm text-destructive">{errors.aniosExperiencia.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="nivelEducativo">
            Nivel educativo máximo alcanzado <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="nivelEducativo"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="nivelEducativo" aria-invalid={!!errors.nivelEducativo}>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.nivelEducativo && <p className="mt-1 text-sm text-destructive">{errors.nivelEducativo.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="disponibilidad">
          Disponibilidad para viajar o reubicarse <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="disponibilidad"
          render={({ field }) => (
            <RadioGroup
              id="disponibilidad"
              onValueChange={field.onChange}
              value={field.value}
              className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {RELOCATION_OPTIONS.map((option) => (
                <label
                  key={option}
                  htmlFor={`disponibilidad-${option}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm font-medium transition-colors",
                    field.value === option
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border/60 text-muted-foreground hover:border-primary/30"
                  )}
                >
                  <RadioGroupItem value={option} id={`disponibilidad-${option}`} />
                  {option}
                </label>
              ))}
            </RadioGroup>
          )}
        />
        {errors.disponibilidad && <p className="mt-1 text-sm text-destructive">{errors.disponibilidad.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="linkedin">Perfil de LinkedIn</Label>
          <Input id="linkedin" {...register("linkedin")} placeholder="linkedin.com/in/tu-perfil (opcional)" />
        </div>
        <div>
          <Label htmlFor="aspiracionSalarial">Aspiración salarial</Label>
          <Input id="aspiracionSalarial" {...register("aspiracionSalarial")} placeholder="Opcional" />
        </div>
      </div>

      <div>
        <Label htmlFor="comoSeEntero">¿Cómo se enteró de la vacante?</Label>
        <Controller
          control={control}
          name="comoSeEntero"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="comoSeEntero">
                <SelectValue placeholder="Selecciona... (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {REFERRAL_SOURCES.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  )
}
