import { Module } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { PublicPositionsController } from './public-positions.controller';
import { VACANCY_REPOSITORY } from './repositories/vacancy.repository.interface';
import { PrismaVacancyRepository } from './repositories/prisma-vacancy.repository';

@Module({
  controllers: [VacanciesController, PublicPositionsController],
  providers: [VacanciesService, { provide: VACANCY_REPOSITORY, useClass: PrismaVacancyRepository }],
  exports: [VacanciesService],
})
export class VacanciesModule {}
