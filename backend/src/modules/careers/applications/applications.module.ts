import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { APPLICATION_REPOSITORY } from './repositories/application.repository.interface';
import { PrismaApplicationRepository } from './repositories/prisma-application.repository';
import { VacanciesModule } from '../vacancies/vacancies.module';
import { MailerModule } from '../../../common/mailer/mailer.module';

@Module({
  imports: [VacanciesModule, MailerModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, { provide: APPLICATION_REPOSITORY, useClass: PrismaApplicationRepository }],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
