import { ApplicationEntity } from '../entities/application.entity';

export interface ApplicationRepository {
  findAll(): Promise<ApplicationEntity[]>;
  findById(id: string): Promise<ApplicationEntity | null>;
  create(data: Omit<ApplicationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApplicationEntity>;
  update(
    id: string,
    data: Partial<Omit<ApplicationEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ApplicationEntity | null>;
  countRecent(days: number): Promise<number>;
}

export const APPLICATION_REPOSITORY = 'APPLICATION_REPOSITORY';
