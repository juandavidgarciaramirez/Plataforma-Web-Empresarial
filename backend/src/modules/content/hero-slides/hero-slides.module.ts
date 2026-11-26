import { Module } from '@nestjs/common';
import { HeroSlidesService } from './hero-slides.service';
import { HeroSlidesController } from './hero-slides.controller';
import { PublicHeroSlidesController } from './public-hero-slides.controller';
import { HERO_SLIDE_REPOSITORY } from './repositories/hero-slide.repository.interface';
import { PrismaHeroSlideRepository } from './repositories/prisma-hero-slide.repository';

@Module({
  controllers: [HeroSlidesController, PublicHeroSlidesController],
  providers: [HeroSlidesService, { provide: HERO_SLIDE_REPOSITORY, useClass: PrismaHeroSlideRepository }],
  exports: [HeroSlidesService],
})
export class HeroSlidesModule {}
