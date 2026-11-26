"use client"

import { cn } from "@/lib/utils/cn"
import { ScrollAnimation } from "@/components/atoms/ScrollAnimation"

export interface ProcessStep {
  step: string
  title: string
  description: string
}

interface ProcessStepsProps {
  steps: ProcessStep[]
  /** "light" para secciones con fondo claro, "dark" para fondo azul marino. */
  theme?: "light" | "dark"
}

/**
 * Ruta numerada de proceso (4 pasos típico), reutilizada en las páginas de
 * servicio para representar ciclos como "diagnóstico → diseño → ejecución →
 * medición" o "diseño → implementación → actualización → seguimiento".
 */
export function ProcessSteps({ steps, theme = "light" }: ProcessStepsProps) {
  const isDark = theme === "dark"

  return (
    <div className="relative">
      {/* Línea de ruta — solo desktop, misma altura que el centro del círculo (h-16 = 64px) */}
      <div
        className={cn(
          "absolute left-0 right-0 top-8 hidden h-px lg:block",
          isDark ? "bg-white/10" : "bg-border"
        )}
      />

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {steps.map((item, index) => (
          <ScrollAnimation key={item.step} delay={index * 0.1}>
            <div className="relative text-center">
              <div
                className={cn(
                  "relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full shadow-lg",
                  isDark
                    ? "bg-teal-400 text-slate-900 shadow-teal-400/20"
                    : "bg-primary text-white shadow-primary/20"
                )}
              >
                <span className="font-display text-xl font-bold">{item.step}</span>
              </div>
              <h3
                className={cn(
                  "mt-4 break-words font-display text-sm font-semibold",
                  isDark && "text-white"
                )}
              >
                {item.title}
              </h3>
              <p
                className={cn(
                  "mt-2 text-sm",
                  isDark ? "text-slate-300" : "text-muted-foreground"
                )}
              >
                {item.description}
              </p>
            </div>
          </ScrollAnimation>
        ))}
      </div>
    </div>
  )
}
