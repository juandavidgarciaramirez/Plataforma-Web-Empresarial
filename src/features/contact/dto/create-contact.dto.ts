import { z } from "zod"
import { services } from "@/data/services"

/**
 * Los slugs de "servicio de interés" se derivan de `src/data/services.ts`
 * (fuente única ya usada por Navbar/Footer/About) en lugar de una lista fija,
 * para que el formulario de Contacto nunca quede desincronizado de las
 * líneas de negocio reales del sitio.
 */
export const SERVICIOS_INTERES = services.map((s) => s.slug) as [string, ...string[]]

export const createContactDto = z.object({
  nombre: z.string().trim().min(3, "El nombre es muy corto").max(150, "El nombre es muy largo"),
  empresa: z.string().trim().max(150).optional().or(z.literal("")),
  correo: z.string().trim().email("Correo electrónico inválido"),
  telefono: z
    .string()
    .trim()
    .regex(/^[0-9+()\s-]{7,20}$/, "Teléfono inválido")
    .optional()
    .or(z.literal("")),
  servicioInteres: z.enum(SERVICIOS_INTERES, {
    message: "Selecciona un servicio de interés válido",
  }),
  mensaje: z
    .string()
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(3000, "El mensaje es muy largo"),
})

export type CreateContactDto = z.infer<typeof createContactDto>
