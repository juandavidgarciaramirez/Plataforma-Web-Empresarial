import { BlogPostEntity } from '../entities/blog-post.entity';

export interface BlogPostRepository {
  findAll(): Promise<BlogPostEntity[]>;
  findById(id: string): Promise<BlogPostEntity | null>;
  findBySlug(slug: string): Promise<BlogPostEntity | null>;
  create(data: Omit<BlogPostEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPostEntity>;
  update(
    id: string,
    data: Partial<Omit<BlogPostEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<BlogPostEntity | null>;
  delete(id: string): Promise<boolean>;
}

export const BLOG_POST_REPOSITORY = 'BLOG_POST_REPOSITORY';
