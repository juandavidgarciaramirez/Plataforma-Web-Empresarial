/**
 * Fuente única de verdad para el número de WhatsApp del asistente flotante y
 * los correos de destino de cada flujo (PQR, Trabaja con nosotros,
 * comercial). Nada debe hardcodear estos valores en otro lugar — sección 16
 * del brief.
 */

export const CONTACT = {
  whatsapp: {
    /** Formato E.164 sin "+", para wa.me. */
    number: "573118636746",
    display: "311 863 6746",
    defaultMessage:
      "Hola, quiero recibir información sobre los servicios de Capital Consulting.",
  },
  emails: {
    /** PQR — exclusivo, no usar para nada comercial. */
    pqr: "contacto@capitalconsulting.com.co",
    /** Trabaja con nosotros / hojas de vida. */
    careers: "peopleandculture@capitalconsulting.com.co",
    /** Cotizaciones y solicitudes comerciales (formulario de Contacto). */
    commercial: "ejecutivacomercial@capitalconsulting.com.co",
  },
} as const

/** Construye un link wa.me con mensaje prellenado (URL-encoded). */
export function buildWhatsAppUrl(message: string = CONTACT.whatsapp.defaultMessage): string {
  return `https://wa.me/${CONTACT.whatsapp.number}?text=${encodeURIComponent(message)}`
}
