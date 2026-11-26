import { CompanyProfileEntity } from '../entities/company-profile.entity';

export interface CompanyProfileRepository {
  /** La fila singleton siempre existe (la crea la migración 006). */
  get(): Promise<CompanyProfileEntity>;
  update(data: Partial<Omit<CompanyProfileEntity, 'updatedAt'>>): Promise<CompanyProfileEntity>;
}

export const COMPANY_PROFILE_REPOSITORY = 'COMPANY_PROFILE_REPOSITORY';
