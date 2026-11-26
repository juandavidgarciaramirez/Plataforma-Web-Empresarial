export type TeamMemberStatus = 'ACTIVE' | 'INACTIVE';
export type TeamMemberOrgLevel = 1 | 2 | 3;
export type TeamMemberConnectorCurve = 'left' | 'right';

export class TeamMemberEntity {
  id!: string;
  name!: string;
  position!: string;
  bio!: string | null;
  photoUrl!: string | null;
  /** Texto alternativo de la fotografía (Etapa 15). null = el sitio usa "Fotografía de <nombre>". */
  photoAlt!: string | null;
  /** Archivo de la fotografía cuando se subió desde el administrador (Etapa 15). */
  photoFileId?: string | null;
  order!: number;
  status!: TeamMemberStatus;

  /** Campos del Organigrama (sección 18 del encargo) — Etapa 7. */
  profession!: string | null;
  area!: string | null;
  /** Línea de servicio asociada (catalog.services.code). */
  serviceCode!: string | null;
  specialties!: string[];
  certifications!: string[] | null;
  certificationsLabel!: string | null;
  isTransversal!: boolean;
  /** Nivel del organigrama (1 = dirección general, 2-3 = equipo). null = no aparece en el organigrama. */
  orgLevel!: TeamMemberOrgLevel | null;
  /** Integrante del que depende jerárquicamente (autorreferencia). */
  parentId!: string | null;
  connectorCurve!: TeamMemberConnectorCurve | null;

  createdAt!: Date;
  updatedAt!: Date;
}
