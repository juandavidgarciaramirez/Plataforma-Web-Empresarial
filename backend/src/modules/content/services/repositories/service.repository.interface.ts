import { ServiceEntity } from '../entities/service.entity';

export interface ServiceRepository {
  findAll(): Promise<ServiceEntity[]>;
  findById(id: string): Promise<ServiceEntity | null>;
  findBySlug(slug: string): Promise<ServiceEntity | null>;
  create(data: Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceEntity>;
  update(
    id: string,
    data: Partial<Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ServiceEntity | null>;
  delete(id: string): Promise<boolean>;
}

export const SERVICE_REPOSITORY = 'SERVICE_REPOSITORY';
