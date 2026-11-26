export const OPPORTUNITY_STAGES = [
  'NEW',
  'QUALIFYING',
  'PROPOSAL',
  'NEGOTIATION',
  'WON',
  'LOST',
] as const;
export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

/** Etapas que cuentan como "cerradas" — no se muestran como pipeline abierto. */
export const CLOSED_STAGES: OpportunityStage[] = ['WON', 'LOST'];

export class OpportunityEntity {
  id!: string;
  title!: string;
  companyId!: string | null;
  contactId!: string | null;
  value!: number;
  currency!: string;
  stage!: OpportunityStage;
  probability!: number | null;
  ownerUserId!: string | null;
  expectedCloseDate!: Date | null;
  sourceLeadId!: string | null;
  closedAt!: Date | null;
  closeReason!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
