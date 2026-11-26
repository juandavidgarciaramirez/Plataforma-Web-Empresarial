import { LeadEntity } from '../entities/lead.entity';

/** Contrato de persistencia para leads. Implementación temporal en memoria. */
export interface LeadRepository {
  findAll(): Promise<LeadEntity[]>;
  findById(id: string): Promise<LeadEntity | null>;
  findByChatSessionId(chatSessionId: string): Promise<LeadEntity | null>;
  create(data: Omit<LeadEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeadEntity>;
  update(
    id: string,
    data: Partial<Omit<LeadEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<LeadEntity | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export const LEAD_REPOSITORY = 'LEAD_REPOSITORY';
