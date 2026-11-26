export type CompanySize = 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE';
export type CompanyStatus = 'ACTIVE' | 'INACTIVE';

export class CompanyEntity {
  id!: string;
  name!: string;
  taxId!: string | null;
  industry!: string | null;
  sizeSegment!: CompanySize | null;
  website!: string | null;
  address!: string | null;
  phone!: string | null;
  ownerUserId!: string | null;
  status!: CompanyStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
