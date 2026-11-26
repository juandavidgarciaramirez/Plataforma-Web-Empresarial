import { Check } from "lucide-react"
import { cn } from "@/lib/utils/cn"

interface FormStepperProps {
  steps: readonly { id: string; label: string }[]
  currentStep: number
}

/**
 * Progreso de un formulario multi-paso (sección 4 y 14 del brief: "utilizar
 * un formulario por bloques/steps", "utilizar... progreso"). Puramente
 * visual — el wizard que lo usa controla `currentStep` y la validación.
 */
export function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <div>
      {/* Desktop / tablet: circulos + etiquetas */}
      <ol className="hidden items-center sm:flex">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep

          return (
            <li key={step.id} className={cn("flex items-center", index !== steps.length - 1 && "flex-1")}>
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isCompleted && "bg-primary text-primary-foreground",
                    isActive && "border-2 border-primary text-primary",
                    !isCompleted && !isActive && "border border-border/60 text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "max-w-[6.5rem] text-center text-[11px] font-medium leading-tight",
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index !== steps.length - 1 && (
                <span
                  className={cn(
                    "mx-2 mb-5 h-px flex-1 transition-colors",
                    isCompleted ? "bg-primary" : "bg-border/60"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile: barra de progreso simple */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Paso {currentStep + 1} de {steps.length}
          </span>
          <span className="text-foreground">{steps[currentStep]?.label}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border/60">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
