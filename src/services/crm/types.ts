/** Tipo de entidad CRM a la que se puede vincular una tarea o actividad. */
export const CRM_ENTITY_TYPES = ["lead", "company", "contact", "opportunity"] as const;
export type CrmEntityType = (typeof CRM_ENTITY_TYPES)[number];

export const CRM_ENTITY_LABELS: Record<CrmEntityType, string> = {
  lead: "Lead",
  company: "Empresa",
  contact: "Contacto",
  opportunity: "Oportunidad",
};
