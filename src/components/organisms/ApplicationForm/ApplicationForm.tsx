"use client"

import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/atoms/Button"
import { FormStepper } from "@/components/molecules/FormStepper/FormStepper"
import { useCreateApplication } from "@/hooks/useCareers"
import { ApiRequestError } from "@/lib/api/client"
import {
  createApplicationDto,
  APPLICATION_STEP_FIELDS,
  type CreateApplicationDto,
} from "@/features/careers/dto/create-application.dto"
import { APPLICATION_FORM_STEPS } from "@/features/careers/careers.constants"
import { PersonalDataStep } from "./steps/PersonalDataStep"
import { ProfessionalProfileStep } from "./steps/ProfessionalProfileStep"
import { SectorStep } from "./steps/SectorStep"
import { ResumeStep } from "./steps/ResumeStep"
import { ConsentStep } from "./steps/ConsentStep"

interface ApplicationFormProps {
  /** Si viene de una vacante puntual, se envía junto con la postulación. */
  vacancySlug?: string
  vacancyTitle?: string
}

const RESUME_STEP_INDEX = APPLICATION_FORM_STEPS.findIndex((step) => step.id === "hoja-de-vida")
const LAST_STEP_INDEX = APPLICATION_FORM_STEPS.length - 1

export function ApplicationForm({ vacancySlug, vacancyTitle }: ApplicationFormProps) {
  const [step, setStep] = useState(0)
  const [resume, setResume] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { mutate, isPending } = useCreateApplication()

  const methods = useForm<CreateApplicationDto>({
    resolver: zodResolver(createApplicationDto),
    defaultValues: {
      sectores: [],
      cargoAspirado: vacancyTitle ?? "",
      vacanteSlug: vacancySlug ?? "",
      autorizacionDatos: false,
      autorizacionComunicaciones: false,
      autorizacionCompartirHV: false,
    },
  })

  const { handleSubmit, trigger, reset } = methods

  const goNext = async () => {
    const currentStepId = APPLICATION_FORM_STEPS[step].id

    if (currentStepId === "hoja-de-vida") {
      if (!resume) {
        setResumeError("La hoja de vida es obligatoria")
        return
      }
      setResumeError(null)
      setStep((s) => Math.min(s + 1, LAST_STEP_INDEX))
      return
    }

    const fields = APPLICATION_STEP_FIELDS[currentStepId]
    const isValid = await trigger([...fields])
    if (isValid) setStep((s) => Math.min(s + 1, LAST_STEP_INDEX))
  }

  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  const onSubmit = (data: CreateApplicationDto) => {
    setServerError(null)

    if (!resume) {
      setResumeError("La hoja de vida es obligatoria")
      setStep(RESUME_STEP_INDEX)
      return
    }
    setResumeError(null)

    const formData = new FormData()
    const payload = { ...data, vacanteSlug: vacancySlug ?? data.vacanteSlug }

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, String(item)))
        return
      }
      formData.append(key, String(value))
    })
    formData.append("hojaDeVida", resume)

    mutate(formData, {
      onSuccess: () => {
        setSubmitted(true)
        reset()
        setResume(null)
        setStep(0)
      },
      onError: (err) => {
        setServerError(
          err instanceof ApiRequestError ? err.message : "No fue posible enviar tu postulación. Intenta nuevamente."
        )
      },
    })
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
          ¡Gracias por compartir tu perfil!
        </h3>
        <p className="mt-2 text-muted-foreground">
          Tu información fue recibida correctamente y hará parte de nuestra Base de Altos Potenciales.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Nuestro equipo de People &amp; Culture podrá contactarte cuando exista una oportunidad acorde con tu perfil.
        </p>
        <div className="mt-6">
          <Button type="button" variant="outline" onClick={() => setSubmitted(false)}>
            Enviar otra postulación
          </Button>
        </div>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && step !== LAST_STEP_INDEX) event.preventDefault()
        }}
        className="space-y-8"
        noValidate
      >
        <FormStepper steps={APPLICATION_FORM_STEPS} currentStep={step} />

        {serverError && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{serverError}</p>
          </div>
        )}

        <div>
          {step === 0 && <PersonalDataStep />}
          {step === 1 && <ProfessionalProfileStep />}
          {step === 2 && <SectorStep />}
          {step === 3 && <ResumeStep resume={resume} onChange={setResume} error={resumeError ?? undefined} />}
          {step === 4 && <ConsentStep />}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-6">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          ) : (
            <span />
          )}

          {step < LAST_STEP_INDEX ? (
            <Button type="button" variant="corporate" onClick={goNext}>
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" variant="corporate" loading={isPending}>
              Enviar postulación
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
