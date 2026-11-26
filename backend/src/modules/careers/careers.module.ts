import { Module } from '@nestjs/common';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ApplicationsModule } from './applications/applications.module';

/** Agrupa "Talento": vacantes y postulaciones. */
@Module({
  imports: [VacanciesModule, ApplicationsModule],
  exports: [VacanciesModule, ApplicationsModule],
})
export class CareersModule {}
