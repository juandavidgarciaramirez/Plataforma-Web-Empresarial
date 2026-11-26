import { Module } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { BlogPostsController } from './blog-posts.controller';
import { PublicBlogController } from './public-blog.controller';
import { BLOG_POST_REPOSITORY } from './repositories/blog-post.repository.interface';
import { PrismaBlogPostRepository } from './repositories/prisma-blog-post.repository';

@Module({
  controllers: [BlogPostsController, PublicBlogController],
  providers: [BlogPostsService, { provide: BLOG_POST_REPOSITORY, useClass: PrismaBlogPostRepository }],
  exports: [BlogPostsService],
})
export class BlogPostsModule {}
