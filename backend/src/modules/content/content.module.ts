import { Module } from '@nestjs/common';
import { ServicesContentModule } from './services/services-content.module';
import { NewsModule } from './news/news.module';
import { BlogPostsModule } from './blog/blog-posts.module';
import { TeamMembersModule } from './team/team-members.module';
import { CompanyProfileModule } from './company-profile/company-profile.module';
import { HeroSlidesModule } from './hero-slides/hero-slides.module';
import { CompanyValuesModule } from './company-values/company-values.module';
import { WhoWeAreConceptsModule } from './who-we-are-concepts/who-we-are-concepts.module';

/**
 * Agrupa los módulos de "Gestionar contenido": servicios, noticias, blog,
 * equipo/organigrama y el contenido institucional de Home/Nosotros (Etapa 7:
 * company-profile, hero-slides, company-values, who-we-are-concepts).
 */
@Module({
  imports: [
    ServicesContentModule,
    NewsModule,
    BlogPostsModule,
    TeamMembersModule,
    CompanyProfileModule,
    HeroSlidesModule,
    CompanyValuesModule,
    WhoWeAreConceptsModule,
  ],
})
export class ContentModule {}
