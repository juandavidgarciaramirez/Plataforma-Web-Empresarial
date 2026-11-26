import { Module } from '@nestjs/common';
import { ServicesContentService } from './services-content.service';
import { ServicesContentController } from './services-content.controller';
import { PublicServicesController } from './public-services.controller';
import { SERVICE_REPOSITORY } from './repositories/service.repository.interface';
import { PrismaServiceRepository } from './repositories/prisma-service.repository';

@Module({
  controllers: [ServicesContentController, PublicServicesController],
  providers: [ServicesContentService, { provide: SERVICE_REPOSITORY, useClass: PrismaServiceRepository }],
  exports: [ServicesContentService],
})
export class ServicesContentModule {}
