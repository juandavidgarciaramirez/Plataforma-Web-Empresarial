import { OpportunityEntity } from '../entities/opportunity.entity';

/** Contrato de persistencia para oportunidades. Implementación temporal en memoria. */
export interface OpportunityRepository {
  findAll(): Promise<OpportunityEntity[]>;
  findById(id: string): Promise<OpportunityEntity | null>;
  create(data: Omit<OpportunityEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<OpportunityEntity>;
  update(
    id: string,
    data: Partial<Omit<OpportunityEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<OpportunityEntity | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export const OPPORTUNITY_REPOSITORY = 'OPPORTUNITY_REPOSITORY';
