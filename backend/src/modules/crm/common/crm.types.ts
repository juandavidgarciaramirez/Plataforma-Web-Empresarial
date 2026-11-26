/**
 * Tipo de entidad CRM a la que se puede vincular una tarea o actividad
 * (relación polimórfica simple: `relatedType` + `relatedId`).
 */
export const CRM_ENTITY_TYPES = ['lead', 'company', 'contact', 'opportunity'] as const;
export type CrmEntityType = (typeof CRM_ENTITY_TYPES)[number];
