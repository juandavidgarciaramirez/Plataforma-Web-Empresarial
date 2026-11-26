import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { CONTACT_SUBMISSION_REPOSITORY } from './repositories/contact-submission.repository.interface';
import { InMemoryContactSubmissionRepository } from './repositories/in-memory-contact-submission.repository';
import { LeadsModule } from '../crm/leads/leads.module';
import { MailerModule } from '../../common/mailer/mailer.module';

/**
 * Formulario público "Contáctenos" (sección 22) — módulo propio, distinto
 * de `crm/contacts` (personas de contacto dentro de una empresa del CRM).
 */
@Module({
  imports: [LeadsModule, MailerModule],
  controllers: [ContactController],
  providers: [
    ContactService,
    { provide: CONTACT_SUBMISSION_REPOSITORY, useClass: InMemoryContactSubmissionRepository },
  ],
  exports: [ContactService],
})
export class ContactModule {}
