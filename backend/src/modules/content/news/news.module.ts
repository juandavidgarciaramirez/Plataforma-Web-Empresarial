import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PublicNewsController } from './public-news.controller';
import { NEWS_REPOSITORY } from './repositories/news.repository.interface';
import { PrismaNewsRepository } from './repositories/prisma-news.repository';

@Module({
  controllers: [NewsController, PublicNewsController],
  providers: [NewsService, { provide: NEWS_REPOSITORY, useClass: PrismaNewsRepository }],
  exports: [NewsService],
})
export class NewsModule {}
