"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone, ChevronDown, LogIn } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import Image from "next/image"
import { services } from "@/data/services"

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Noticias", href: "/noticias" },
  { label: "PQR", href: "/pqr" },
  { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
  { label: "Contacto", href: "/contacto" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false)

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-black/[0.06] bg-white/95 shadow-[0_1px_3px_rgba(6,26,53,0.04)] backdrop-blur-md dark:border-white/[0.06] dark:bg-slate-950/95">
      <div className="container mx-auto px-6 md:px-10 lg:px-8 xl:px-20">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
  {/* Imagen del logo */}
  <Image
    src="/images/logo.png"
    alt="Capital Consulting & Services SAS"
    width={48}
    height={48}
    className="h-11 w-auto object-contain"
    priority
  />
  {/* Texto */}
  <div className="flex flex-col">
    <span className="font-display text-base font-bold leading-tight tracking-[-0.01em] text-corporate-dark dark:text-white">
      CAPITAL CONSULTING
    </span>
    <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground">
      AND SERVICES SAS
    </span>
  </div>
</Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-7">
            <Link
              href="/"
              className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Inicio
            </Link>

            {/* Servicios dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
                onClick={() => setIsServicesOpen((v) => !v)}
              >
                Servicios
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isServicesOpen && "rotate-180"
                  )}
                />
              </button>

              {isServicesOpen && (
                <div className="absolute left-1/2 top-full w-96 -translate-x-1/2 pt-3">
                  <div className="overflow-hidden rounded-lg border border-border/40 bg-white shadow-xl dark:bg-slate-900">
                    <ul className="grid grid-cols-1 gap-1 p-2">
                      {services.map((service) => {
                        const Icon = service.icon
                        return (
                          <li key={service.slug}>
                            <Link
                              href={service.href}
                              className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                              onClick={() => setIsServicesOpen(false)}
                            >
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <Icon className="h-4 w-4" />
                              </span>
                              <span>
                                <span className="block text-sm font-medium text-foreground">
                                  {service.name}
                                </span>
                                <span className="mt-0.5 block text-xs text-muted-foreground line-clamp-1">
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

            {navItems
              .filter((item) => item.label !== "Inicio")
              .map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                title="Acceso"
              >
                <LogIn className="h-4 w-4" />
                Acceso
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/40">
            <Link
              href="/"
              className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>

            {/* Servicios accordion */}
            <div>
              <button
                type="button"
                className="flex w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                aria-expanded={isMobileServicesOpen}
                onClick={() => setIsMobileServicesOpen((v) => !v)}
              >
                Servicios
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isMobileServicesOpen && "rotate-180"
                  )}
                />
              </button>
              {isMobileServicesOpen && (
                <div className="ml-3 border-l border-border/40 pl-3">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      href={service.href}
                      className="block py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => {
                        setIsOpen(false)
                        setIsMobileServicesOpen(false)
                      }}
                    >
                      {service.name}
                    </Link>
                  ))}

                </div>
              )}
            </div>

            {navItems
              .filter((item) => item.label !== "Inicio")
              .map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            <a
              href="tel:+573118636746"
              className="mt-2 flex items-center gap-2 text-sm font-medium text-primary"
            >
              <Phone className="h-4 w-4" />
              311 8636746
            </a>

            <Link
              href="/login"
              className="mt-2 flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              Acceso
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
