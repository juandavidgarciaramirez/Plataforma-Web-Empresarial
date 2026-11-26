import { CompanyEntity } from '../entities/company.entity';

/**
 * Contrato de persistencia para empresas. Implementación temporal en
 * memoria; se reemplaza por PostgreSQL (esquema `crm`) sin tocar
 * CompaniesService.
 */
export interface CompanyRepository {
  findAll(): Promise<CompanyEntity[]>;
  findById(id: string): Promise<CompanyEntity | null>;
  create(data: Omit<CompanyEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyEntity>;
  update(
    id: string,
    data: Partial<Omit<CompanyEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<CompanyEntity | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export const COMPANY_REPOSITORY = 'COMPANY_REPOSITORY';
