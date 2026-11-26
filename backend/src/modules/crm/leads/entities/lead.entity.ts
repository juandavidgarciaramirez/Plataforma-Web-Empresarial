export const LEAD_SOURCES = ['YURI', 'WEBSITE_FORM', 'REFERRAL', 'MANUAL', 'CHAT', 'PQR'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export class LeadEntity {
  id!: string;
  name!: string;
  email!: string | null;
  phone!: string | null;
  companyName!: string | null;
  source!: LeadSource;
  serviceInterest!: string | null;
  status!: LeadStatus;
  ownerUserId!: string | null;
  notes!: string | null;
  /** Sesión de chat de Yuri que originó el lead (idempotencia: 1 sesión → 1 lead). */
  chatSessionId!: string | null;
  convertedToOpportunityId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
