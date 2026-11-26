/**
 * Contenido de la Política de Privacidad del sitio web de Capital Consulting
 * and Services S.A.S.
 *
 * ⚠️ CONTENIDO PENDIENTE DE APROBACIÓN OFICIAL ⚠️
 * Capital Consulting aún no ha entregado un documento oficial de "Política
 * de Privacidad" independiente de la Política de Tratamiento de Datos
 * Personales. Este texto es un borrador descriptivo, no vinculante, que
 * explica en términos generales el tratamiento de información en el sitio
 * web y remite en todo lo sustancial a la Política de Tratamiento de Datos
 * Personales oficial (`/politica-tratamiento-datos`), que sí es el
 * documento vigente y aprobado. No inventa plazos de conservación,
 * finalidades adicionales ni terceros no mencionados en dicho documento.
 *
 * Cuando Capital Consulting entregue una Política de Privacidad oficial,
 * reemplaza `PRIVACY_POLICY_SECTIONS` por su texto literal y marca
 * `PRIVACY_POLICY_IS_OFFICIAL` en `true`.
 */

import type { PolicySection } from "./data-policy"

export const PRIVACY_POLICY_IS_OFFICIAL = false as const

export const PRIVACY_POLICY_VERSION = "0.1-borrador"
export const PRIVACY_POLICY_LAST_UPDATED = "2026-08-24"

export const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "objeto",
    title: "1. Objeto de esta política",
    paragraphs: [
      "Esta Política de Privacidad describe, en términos generales, cómo Capital Consulting and Services S.A.S. recopila y utiliza la información de quienes visitan e interactúan con este sitio web (formularios de contacto, PQR, postulaciones y navegación general).",
      "Esta página se encuentra en borrador y pendiente de aprobación oficial por parte de Capital Consulting. En todo lo relativo al tratamiento de datos personales, prevalece la Política de Tratamiento de Datos Personales oficial de la compañía.",
    ],
  },
  {
    id: "informacion-recopilada",
    title: "2. Información que se recopila en el sitio",
    paragraphs: [
      "A través de los formularios del sitio (Contacto, PQR y Trabaja con nosotros) se recopila la información que el usuario suministra voluntariamente, como nombre, datos de contacto, empresa, mensaje y, en el caso de postulaciones, información profesional y la hoja de vida.",
      "El sitio también puede utilizar cookies y tecnologías similares para su funcionamiento y, cuando el usuario lo autorice, para fines de preferencia, analítica o marketing. Puedes revisar y ajustar estas categorías en cualquier momento desde 'Preferencias de cookies' en el pie de página.",
    ],
  },
  {
    id: "uso-informacion",
    title: "3. Uso de la información",
    paragraphs: [
      "La información recopilada se utiliza para atender la solicitud, PQR o postulación del usuario, gestionar la relación comercial o laboral correspondiente y cumplir las finalidades descritas en la Política de Tratamiento de Datos Personales oficial de Capital Consulting.",
    ],
  },
  {
    id: "relacion-politica-datos",
    title: "4. Relación con la Política de Tratamiento de Datos Personales",
    paragraphs: [
      "Todo lo relativo a la recolección, uso, circulación, transferencia, conservación, derechos del titular y procedimiento de consultas y reclamos sobre datos personales se rige por la Política de Tratamiento de Datos Personales de Capital Consulting and Services S.A.S., disponible en /politica-tratamiento-datos, que es el documento oficial vigente.",
    ],
  },
  {
    id: "seguridad",
    title: "5. Seguridad de la información",
    paragraphs: [
      "Capital Consulting adopta medidas razonables, administrativas y técnicas, para proteger la información recopilada a través del sitio, en línea con lo establecido en la Política de Tratamiento de Datos Personales oficial.",
    ],
  },
  {
    id: "cambios",
    title: "6. Cambios a esta política",
    paragraphs: [
      "Esta Política de Privacidad podrá actualizarse. Cuando exista una versión oficial aprobada por Capital Consulting, reemplazará íntegramente este borrador.",
    ],
  },
  {
    id: "contacto",
    title: "7. Contacto",
    paragraphs: [
      "Para consultas sobre esta política o sobre el tratamiento de tus datos personales, puedes escribir a protecciondedatos@capitalconsulting.com.co.",
    ],
  },
]
