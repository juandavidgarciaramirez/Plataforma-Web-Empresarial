"use client"

import Link from "next/link"
import { Controller, useFormContext } from "react-hook-form"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  COMPANY_LEGAL_INFO,
  DATA_POLICY_PATH,
  MAIN_CONSENT_CHECKBOX_LABEL,
  MAIN_CONSENT_PARAGRAPHS,
  OPTIONAL_CONSENT_COMMS_TEXT,
  OPTIONAL_CONSENT_SHARE_TEXT,
} from "@/data/legal/data-policy"
import { LEGAL_ROUTES } from "@/config/legal"
import type { CreateApplicationDto } from "@/features/careers/dto/create-application.dto"

/** Autorización de datos personales — secciones 5 a 8 del brief. */
export function ConsentStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateApplicationDto>()

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/50 bg-slate-50 p-5 dark:bg-slate-900/40">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h4 className="font-display text-base font-semibold text-foreground">
              Autorización para el tratamiento de datos personales y sensibles
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Responsable: {COMPANY_LEGAL_INFO.razonSocial} · NIT {COMPANY_LEGAL_INFO.nit} ·{" "}
              {COMPANY_LEGAL_INFO.domicilio}
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="autorizacion" className="border-border/50">
            <AccordionTrigger className="text-sm font-medium text-foreground">
              Ver texto completo de la autorización
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-h-64 space-y-3 overflow-y-auto pr-2 text-sm leading-relaxed text-muted-foreground">
                {MAIN_CONSENT_PARAGRAPHS.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <p className="mt-4 text-sm text-muted-foreground">Consulta nuestras políticas</p>
        <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1.5">
          <Link
            href={DATA_POLICY_PATH}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Ver política de tratamiento de datos
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={LEGAL_ROUTES.privacyUrl}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Ver política de privacidad
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 flex items-start space-x-2.5 border-t border-border/50 pt-4">
          <Controller
            control={control}
            name="autorizacionDatos"
            render={({ field }) => (
              <Checkbox
                id="autorizacionDatos"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={!!errors.autorizacionDatos}
                className="mt-0.5"
              />
            )}
          />
          <Label htmlFor="autorizacionDatos" className="text-sm font-normal leading-snug">
            {MAIN_CONSENT_CHECKBOX_LABEL} <span className="text-destructive">*</span>
          </Label>
        </div>
        {errors.autorizacionDatos && (
          <p className="mt-1.5 text-sm text-destructive">{errors.autorizacionDatos.message}</p>
        )}
      </div>

      <div className="space-y-4 rounded-xl border border-border/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Autorizaciones opcionales
        </p>

        <div className="flex items-start space-x-2.5">
          <Controller
            control={control}
            name="autorizacionComunicaciones"
            render={({ field }) => (
              <Checkbox
                id="autorizacionComunicaciones"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
            )}
          />
          <Label htmlFor="autorizacionComunicaciones" className="text-sm font-normal leading-snug text-muted-foreground">
            {OPTIONAL_CONSENT_COMMS_TEXT}
          </Label>
        </div>

        <div className="flex items-start space-x-2.5">
          <Controller
            control={control}
            name="autorizacionCompartirHV"
            render={({ field }) => (
              <Checkbox
                id="autorizacionCompartirHV"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
            )}
          />
          <Label htmlFor="autorizacionCompartirHV" className="text-sm font-normal leading-snug text-muted-foreground">
            {OPTIONAL_CONSENT_SHARE_TEXT}
          </Label>
        </div>
      </div>
    </div>
  )
}
