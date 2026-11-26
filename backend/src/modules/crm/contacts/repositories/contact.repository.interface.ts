import { ContactEntity } from '../entities/contact.entity';

/** Contrato de persistencia para contactos. Implementación temporal en memoria. */
export interface ContactRepository {
  findAll(): Promise<ContactEntity[]>;
  findById(id: string): Promise<ContactEntity | null>;
  findByCompanyId(companyId: string): Promise<ContactEntity[]>;
  create(data: Omit<ContactEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactEntity>;
  update(
    id: string,
    data: Partial<Omit<ContactEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ContactEntity | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export const CONTACT_REPOSITORY = 'CONTACT_REPOSITORY';
