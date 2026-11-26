import { CrmEntityType } from '../../common/crm.types';

/**
 * `NOTE` cubre las "notas" del brief — una nota es una actividad sin más
 * estructura. El catálogo une los tipos de "Interacciones" (sección 24) y
 * "Actividades" (sección 25) del brief en un solo modelo: ambos son, en la
 * práctica, un evento fechado y registrable desde Lead/Empresa/Contacto/
 * Oportunidad — separarlos en dos módulos hubiera sido duplicar el mismo
 * concepto.
 */
export const ACTIVITY_TYPES = [
  'CALL',
  'EMAIL',
  'WHATSAPP',
  'MEETING',
  'NOTE',
  'WEB',
  'INSTAGRAM',
  'FACEBOOK',
  'FOLLOW_UP',
  'OTHER',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export class ActivityEntity {
  id!: string;
  type!: ActivityType;
  description!: string;
  authorUserId!: string | null;
  occurredAt!: Date;
  relatedType!: CrmEntityType | null;
  relatedId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
