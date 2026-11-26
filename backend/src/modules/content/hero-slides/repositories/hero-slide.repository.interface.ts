import { HeroSlideEntity } from '../entities/hero-slide.entity';

export interface HeroSlideRepository {
  findAll(): Promise<HeroSlideEntity[]>;
  findById(id: string): Promise<HeroSlideEntity | null>;
  create(data: Omit<HeroSlideEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeroSlideEntity>;
  update(
    id: string,
    data: Partial<Omit<HeroSlideEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<HeroSlideEntity | null>;
  delete(id: string): Promise<boolean>;
}

export const HERO_SLIDE_REPOSITORY = 'HERO_SLIDE_REPOSITORY';
