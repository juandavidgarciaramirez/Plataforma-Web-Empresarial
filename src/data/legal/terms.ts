/**
 * Estructura de los Términos y Condiciones del sitio web de Capital
 * Consulting and Services S.A.S.
 *
 * ⚠️ CONTENIDO PENDIENTE DE APROBACIÓN OFICIAL ⚠️
 * Capital Consulting no ha entregado todavía un documento oficial de
 * Términos y Condiciones. Por instrucción expresa del brief (sección 6), en
 * este caso NO se redactan cláusulas jurídicas — solo se deja lista la
 * estructura visual (encabezado, índice, secciones) con el espacio
 * reservado para el texto oficial que Capital Consulting apruebe.
 *
 * Cuando Capital Consulting entregue el documento oficial, reemplaza
 * `TERMS_SECTIONS` por su texto literal y marca `TERMS_IS_OFFICIAL` en
 * `true`.
 */

import type { PolicySection } from "./data-policy"

export const TERMS_IS_OFFICIAL = false as const

export const TERMS_VERSION = "0.1-borrador"
export const TERMS_LAST_UPDATED = "2026-08-24"

const PENDING_NOTE = "Sección preparada en espera del texto oficial aprobado por Capital Consulting and Services S.A.S."

export const TERMS_SECTIONS: PolicySection[] = [
  { id: "objeto", title: "1. Objeto", paragraphs: [PENDING_NOTE] },
  { id: "aceptacion", title: "2. Aceptación de los términos", paragraphs: [PENDING_NOTE] },
  { id: "uso-del-sitio", title: "3. Uso del sitio y de los servicios", paragraphs: [PENDING_NOTE] },
  { id: "cuentas-formularios", title: "4. Formularios, cuentas y contenido enviado por el usuario", paragraphs: [PENDING_NOTE] },
  { id: "propiedad-intelectual", title: "5. Propiedad intelectual", paragraphs: [PENDING_NOTE] },
  { id: "enlaces-terceros", title: "6. Enlaces a sitios de terceros", paragraphs: [PENDING_NOTE] },
  { id: "responsabilidad", title: "7. Limitación de responsabilidad", paragraphs: [PENDING_NOTE] },
  { id: "proteccion-datos", title: "8. Protección de datos personales", paragraphs: [
    "El tratamiento de datos personales realizado a través de este sitio se rige por la Política de Tratamiento de Datos Personales de Capital Consulting and Services S.A.S., disponible en /politica-tratamiento-datos.",
  ] },
  { id: "modificaciones", title: "9. Modificaciones a estos términos", paragraphs: [PENDING_NOTE] },
  { id: "ley-aplicable", title: "10. Ley aplicable y jurisdicción", paragraphs: [PENDING_NOTE] },
  { id: "contacto", title: "11. Contacto", paragraphs: [PENDING_NOTE] },
]
