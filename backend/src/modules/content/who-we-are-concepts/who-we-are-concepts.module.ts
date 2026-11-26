import { Module } from '@nestjs/common';
import { WhoWeAreConceptsService } from './who-we-are-concepts.service';
import { WhoWeAreConceptsController } from './who-we-are-concepts.controller';
import { PublicWhoWeAreConceptsController } from './public-who-we-are-concepts.controller';
import { WHO_WE_ARE_CONCEPT_REPOSITORY } from './repositories/who-we-are-concept.repository.interface';
import { PrismaWhoWeAreConceptRepository } from './repositories/prisma-who-we-are-concept.repository';

@Module({
  controllers: [WhoWeAreConceptsController, PublicWhoWeAreConceptsController],
  providers: [
    WhoWeAreConceptsService,
    { provide: WHO_WE_ARE_CONCEPT_REPOSITORY, useClass: PrismaWhoWeAreConceptRepository },
  ],
  exports: [WhoWeAreConceptsService],
})
export class WhoWeAreConceptsModule {}
