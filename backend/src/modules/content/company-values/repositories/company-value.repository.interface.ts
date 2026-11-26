import { CompanyValueEntity } from '../entities/company-value.entity';

export interface CompanyValueRepository {
  findAll(): Promise<CompanyValueEntity[]>;
  findById(id: string): Promise<CompanyValueEntity | null>;
  create(data: Omit<CompanyValueEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyValueEntity>;
  update(
    id: string,
    data: Partial<Omit<CompanyValueEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<CompanyValueEntity | null>;
  delete(id: string): Promise<boolean>;
}

export const COMPANY_VALUE_REPOSITORY = 'COMPANY_VALUE_REPOSITORY';
