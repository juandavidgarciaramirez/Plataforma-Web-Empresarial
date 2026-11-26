import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { CONTACT_REPOSITORY } from './repositories/contact.repository.interface';
import { PrismaContactRepository } from './repositories/prisma-contact.repository';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [CompaniesModule],
  controllers: [ContactsController],
  providers: [ContactsService, { provide: CONTACT_REPOSITORY, useClass: PrismaContactRepository }],
  exports: [ContactsService],
})
export class ContactsModule {}
