import { WhoWeAreConceptEntity } from '../entities/who-we-are-concept.entity';

export interface WhoWeAreConceptRepository {
  findAll(): Promise<WhoWeAreConceptEntity[]>;
  findById(id: string): Promise<WhoWeAreConceptEntity | null>;
  create(
    data: Omit<WhoWeAreConceptEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WhoWeAreConceptEntity>;
  update(
    id: string,
    data: Partial<Omit<WhoWeAreConceptEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<WhoWeAreConceptEntity | null>;
  delete(id: string): Promise<boolean>;
}

export const WHO_WE_ARE_CONCEPT_REPOSITORY = 'WHO_WE_ARE_CONCEPT_REPOSITORY';
