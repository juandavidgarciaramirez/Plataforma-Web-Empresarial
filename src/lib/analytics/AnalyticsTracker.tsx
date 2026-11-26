"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { CONTACT } from "@/config/contact"
import { trackEvent, trackExit, trackPageview } from "./tracker"

function mailboxOf(address: string): string {
  const email = decodeURIComponent(address).toLowerCase()
  if (email === CONTACT.emails.commercial) return "comercial"
  if (email === CONTACT.emails.pqr) return "pqr"
  if (email === CONTACT.emails.careers) return "talento"
  return "otro"
}

/**
 * Montado una sola vez en el layout público (`(public)/layout.tsx`): las
 * rutas del panel, del login y de la API nunca lo cargan. Registra la página
 * vista en cada cambio de ruta del App Router (sin recargas) y los clics de
 * conversión por delegación, sin tocar cada componente que muestra un enlace.
 */
export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) trackPageview(pathname)
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]")
      if (!anchor) return
      let url: URL
      try {
        url = new URL(anchor.getAttribute("href") ?? "", window.location.href)
      } catch {
        return
      }
      const location = window.location.pathname
      if (url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com")) {
        trackEvent("whatsapp_click", { location })
      } else if (url.protocol === "mailto:") {
        trackEvent("email_click", { mailbox: mailboxOf(url.pathname), location })
      } else if (url.origin === window.location.origin) {
        const service = url.pathname.match(/^\/servicios\/([a-z0-9-]+)\/?$/)?.[1]
        if (service && !location.startsWith(`/servicios/${service}`)) trackEvent("service_click", { service, location })
        const vacancy = url.pathname.match(/^\/trabaja-con-nosotros\/([a-z0-9-]+)\/?$/)?.[1]
        if (vacancy) trackEvent("vacancy_click", { vacancy })
      }
    }
    const onHide = () => {
      if (document.visibilityState === "hidden") trackExit()
    }
    document.addEventListener("click", onClick, { capture: true })
    document.addEventListener("visibilitychange", onHide)
    window.addEventListener("pagehide", trackExit)
    return () => {
      document.removeEventListener("click", onClick, { capture: true })
      document.removeEventListener("visibilitychange", onHide)
      window.removeEventListener("pagehide", trackExit)
    }
  }, [])

  return null
}
