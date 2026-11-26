import { NewsEntity } from '../entities/news.entity';

export interface NewsRepository {
  findAll(): Promise<NewsEntity[]>;
  findById(id: string): Promise<NewsEntity | null>;
  findBySlug(slug: string): Promise<NewsEntity | null>;
  create(data: Omit<NewsEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsEntity>;
  update(id: string, data: Partial<Omit<NewsEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<NewsEntity | null>;
  delete(id: string): Promise<boolean>;
}

export const NEWS_REPOSITORY = 'NEWS_REPOSITORY';
