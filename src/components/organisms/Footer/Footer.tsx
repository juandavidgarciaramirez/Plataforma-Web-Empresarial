import Link from "next/link"
import Image from "next/image"
import {
  Facebook,
  Linkedin,
  Instagram,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

import { CONTACT } from "@/config/contact"
import { LEGAL_ROUTES } from "@/config/legal"
import { NAP } from "@/config/site"
import { CookiePreferencesLink } from "@/components/organisms/CookieConsent"
import { services } from "@/data/services"

const companyLinks = [
  { label: "Nosotros", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "PQR", href: "/pqr" },
  {
    label: "Noticias",
    href: "/noticias",
  },
  {
    label: "Trabaja con nosotros",
    href: "/trabaja-con-nosotros",
  },
  { label: "Contacto", href: "/contacto" },
]

const legalLinks = [
  {
    label: "Política de Privacidad",
    href: LEGAL_ROUTES.privacyUrl,
  },
  {
    label: "Política de Tratamiento de Datos",
    href: LEGAL_ROUTES.dataPolicyUrl,
  },
  {
    label: "Términos y Condiciones",
    href: LEGAL_ROUTES.termsUrl,
  },
]

const phoneNumbers = NAP.phones

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61591828441264&mibextid=rS40aB7S9Ucbxw6v",
    label: "Facebook",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/capital-consulting-and-services-sas/",
    label: "LinkedIn",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/capitalconsulting_1?utm_source=qr&igsh=MTZrNXlrYWhlZ3VubA%3D%3D",
    label: "Instagram",
  },
]

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-14 md:px-10 lg:px-16 xl:px-20">
        {/* ========================================================= */}
        {/* CONTENIDO PRINCIPAL */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 xl:gap-14">

          {/* ======================================================= */}
          {/* COLUMNA 1 — MARCA */}
          {/* ======================================================= */}
          <div className="min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-4"
            >
              <Image
                src="/images/logo-white.png"
                alt="Capital Consulting & Services SAS"
                width={90}
                height={90}
                className="h-20 w-auto object-contain"
                priority
              />

              <div className="border-l border-white/20 pl-4">
                <span className="block font-display text-xl font-bold leading-tight text-white">
                  CAPITAL CONSULTING
                </span>

                <span className="mt-1 block text-[10px] font-medium tracking-[0.18em] text-slate-400">
                  AND SERVICES SAS
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-6 text-slate-400">
              Transformamos empresas con estrategia, innovación y compromiso.
            </p>

            {/* Redes sociales */}
            <div className="mt-7">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Síguenos
              </p>

              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* COLUMNA 2 — SERVICIOS */}
          {/* ======================================================= */}
          <div>
            <h3 className="font-display text-lg font-bold uppercase text-white">
              Servicios
            </h3>

            <div className="mt-3 h-0.5 w-10 bg-primary" />

            <ul className="mt-5 space-y-1">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={service.href}
                    className="group flex items-center gap-2 py-2 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="text-primary opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                      →
                    </span>

                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {service.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ======================================================= */}
          {/* COLUMNA 3 — ENLACES */}
          {/* ======================================================= */}
          <div>
            <h3 className="font-display text-lg font-bold uppercase text-white">
              Enlaces
            </h3>

            <div className="mt-3 h-0.5 w-10 bg-primary" />

            <ul className="mt-5 space-y-1">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 py-2 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="text-primary opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                      →
                    </span>

                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ======================================================= */}
          {/* COLUMNA 4 — CONTÁCTANOS */}
          {/* ======================================================= */}
          <div>
            <h3 className="font-display text-lg font-bold uppercase text-white">
              Contáctanos
            </h3>

            <div className="mt-3 h-0.5 w-10 bg-primary" />

            <div className="mt-5 space-y-5">

              {/* Teléfonos */}
              <div className="space-y-3">
                {phoneNumbers.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:+57${phone.replace(/\s/g, "")}`}
                    className="group flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Phone className="h-4 w-4" />
                    </span>

                    <span>{phone}</span>
                  </a>
                ))}
              </div>

              {/* Correo */}
              <a
                href={`mailto:${CONTACT.emails.pqr}`}
                className="group flex min-w-0 items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Mail className="h-4 w-4" />
                </span>

                <span className="min-w-0 break-words pt-1 leading-5">
                  {CONTACT.emails.pqr}
                </span>
              </a>

              {/* Dirección */}
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </span>

                <span className="pt-1 leading-5">
                  {NAP.streetAddress}
                  <br />
                  {NAP.addressLocality}, Colombia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECCIÓN LEGAL */}
        {/* ========================================================= */}
        <div className="mt-12 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* Información corporativa */}
            <div className="text-center text-xs leading-5 text-slate-500 lg:text-left">
              <p>
                <span className="text-slate-400">
                  © {new Date().getFullYear()} Capital Consulting & Services SAS.
                </span>{" "}
                Todos los derechos reservados.
              </p>

              <p className="mt-1">
                NIT {NAP.nit} · {NAP.fullAddress}
              </p>
            </div>

            {/* Enlaces legales */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 lg:justify-end">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-slate-500 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <CookiePreferencesLink className="text-xs text-slate-500 transition-colors hover:text-white" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DESARROLLADO POR */}
        {/* ========================================================= */}
        <div className="mt-5 flex justify-center border-t border-white/5 pt-5 md:justify-end">
          <p className="text-xs text-slate-600">
            Desarrollado por{" "}
            <a
              href="https://www.judsolutions.com.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-500 transition-colors hover:text-primary"
            >
              JudSolutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}