import { VacancyEntity } from '../entities/vacancy.entity';

export interface VacancyRepository {
  findAll(): Promise<VacancyEntity[]>;
  findById(id: string): Promise<VacancyEntity | null>;
  findBySlug(slug: string): Promise<VacancyEntity | null>;
  create(data: Omit<VacancyEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<VacancyEntity>;
  update(
    id: string,
    data: Partial<Omit<VacancyEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<VacancyEntity | null>;
  delete(id: string): Promise<boolean>;
}

export const VACANCY_REPOSITORY = 'VACANCY_REPOSITORY';
