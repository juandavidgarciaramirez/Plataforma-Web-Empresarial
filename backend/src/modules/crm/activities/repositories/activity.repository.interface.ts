import { ActivityEntity } from '../entities/activity.entity';

/** Contrato de persistencia para actividades. Implementación temporal en memoria. */
export interface ActivityRepository {
  findAll(): Promise<ActivityEntity[]>;
  findById(id: string): Promise<ActivityEntity | null>;
  create(data: Omit<ActivityEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActivityEntity>;
  update(
    id: string,
    data: Partial<Omit<ActivityEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ActivityEntity | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export const ACTIVITY_REPOSITORY = 'ACTIVITY_REPOSITORY';
