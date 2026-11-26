"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { services } from "@/data/services"
import { cn } from "@/lib/utils/cn"

interface ServicesMenuProps {
  variant?: "desktop" | "mobile" | "footer"
}

export function ServicesMenu({ variant = "desktop" }: ServicesMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  /*
   * ============================================================
   * MOBILE
   * ============================================================
   * En móvil no existe hover real.
   * Servicios se abre mediante click/touch.
   */
  if (variant === "mobile") {
    return (
      <div>
        <button
          type="button"
          className="flex w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span>Servicios</span>

          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="ml-3 border-l border-border/40 pl-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={service.href}
                className="block py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {service.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  /*
   * ============================================================
   * FOOTER
   * ============================================================
   *
   * Comportamiento:
   *
   *   Cursor entra en Servicios -> ABRE
   *   Cursor pasa al menú      -> SE MANTIENE ABIERTO
   *   Cursor sale del menú    -> CIERRA
   *
   * El menú aparece hacia ARRIBA porque está en el Footer.
   */
  if (variant === "footer") {
    return (
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Botón Servicios */}
        <button
          type="button"
          className="flex w-full items-center justify-between text-sm text-slate-400 transition-colors hover:text-white"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>Servicios</span>

          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          /*
           * IMPORTANTE:
           * pb-3 crea una zona invisible entre el botón y el panel.
           * Así el cursor puede desplazarse hasta el menú sin
           * activar onMouseLeave.
           */
          <div className="absolute bottom-full left-0 z-[100] w-80 pb-3">
            <div className="overflow-hidden rounded-xl border border-white/15 bg-slate-800/95 p-2 shadow-2xl backdrop-blur-md">
              <div className="px-3 pb-2 pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Nuestros servicios
                </span>
              </div>

              <ul className="space-y-1">
                {services.map((service) => {
                  const Icon = service.icon

                  return (
                    <li key={service.slug}>
                      <Link
                        href={service.href}
                        className="group flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">
                            {service.name}
                          </span>

                          <span className="mt-0.5 block line-clamp-1 text-xs text-slate-400">
                            {service.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }

  /*
   * ============================================================
   * DESKTOP NAVBAR
   * ============================================================
   *
   * Se mantiene el comportamiento que ya funciona:
   *
   *   Cursor entra -> abre
   *   Cursor sale  -> cierra
   */
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen((value) => !value)}
      >
        Servicios

        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 top-full z-50 w-96 -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-lg border border-border/40 bg-white shadow-xl dark:bg-slate-900">
            <ul className="grid grid-cols-1 gap-1 p-2">
              {services.map((service) => {
                const Icon = service.icon

                return (
                  <li key={service.slug}>
                    <Link
                      href={service.href}
                      className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>

                      <span>
                        <span className="block text-sm font-medium text-foreground">
                          {service.name}
                        </span>

                        <span className="mt-0.5 block line-clamp-1 text-xs text-muted-foreground">
                          {service.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}