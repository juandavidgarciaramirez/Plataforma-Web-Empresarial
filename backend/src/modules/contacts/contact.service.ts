import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CONTACT_SUBMISSION_REPOSITORY,
  ContactSubmissionRepository,
} from './repositories/contact-submission.repository.interface';
import { CreateContactPublicDto } from './dto/create-contact-public.dto';
import { ContactSubmissionEntity } from './entities/contact-submission.entity';
import { LeadsService } from '../crm/leads/leads.service';
import { MAILER, Mailer } from '../../common/mailer/mailer.interface';

/** Correo comercial oficial (sección 22/26 del encargo). NO usar "ejecutivocomercial@" (sin la "a"). */
const COMMERCIAL_INTERNAL_EMAIL = 'ejecutivacomercial@capitalconsulting.com.co';

@Injectable()
export class ContactService {
  private readonly logger = new Logger('ContactService');

  constructor(
    @Inject(CONTACT_SUBMISSION_REPOSITORY) private readonly repository: ContactSubmissionRepository,
    @Inject(MAILER) private readonly mailer: Mailer,
    private readonly leadsService: LeadsService,
  ) {}

  findAll(): Promise<ContactSubmissionEntity[]> {
    return this.repository.findAll();
  }

  countRecent(days = 30): Promise<number> {
    return this.repository.countRecent(days);
  }

  /**
   * Flujo completo de la sección 53 del encargo: Formulario → DB → CRM →
   * email interno → email cliente. La captura del lead es best-effort (un
   * fallo del CRM nunca debe impedir que el ciudadano reciba su
   * confirmación) — mismo criterio que ya usaba el backend duplicado que
   * este servicio reemplaza.
   */
  async createPublic(dto: CreateContactPublicDto, ip: string): Promise<ContactSubmissionEntity> {
    const created = await this.repository.create({
      name: dto.nombre,
      company: dto.empresa || null,
      email: dto.correo,
      phone: dto.telefono || null,
      serviceInterest: dto.servicioInteres,
      message: dto.mensaje,
      source: 'WEB',
      ip,
    });

    try {
      await this.leadsService.captureFromWebForm({
        name: dto.nombre,
        email: dto.correo,
        phone: dto.telefono || null,
        companyName: dto.empresa || null,
        serviceInterest: dto.servicioInteres,
        notes: dto.mensaje,
      });
    } catch (error) {
      this.logger.error('No se pudo registrar el lead en el CRM', error as Error);
    }

    await this.notifyCreated(created);

    return created;
  }

  private async notifyCreated(contact: ContactSubmissionEntity): Promise<void> {
    try {
      await this.mailer.send({
        to: COMMERCIAL_INTERNAL_EMAIL,
        from: COMMERCIAL_INTERNAL_EMAIL,
        replyTo: contact.email,
        subject: `Nueva solicitud de contacto — ${contact.name}`,
        text: `Nombre: ${contact.name}
  Empresa: ${contact.company ?? '-'}
  Correo: ${contact.email}
  Teléfono: ${contact.phone ?? '-'}
  Servicio de interés: ${contact.serviceInterest}

  ${contact.message}`,
      });
    } catch {
      // Best-effort.
    }

    try {
      await this.mailer.send({
        to: contact.email,
        from: COMMERCIAL_INTERNAL_EMAIL,
        subject: 'Recibimos tu solicitud — Capital Consulting',
        text: `Hola ${contact.name},

  Recibimos correctamente tu solicitud de asesoría sobre ${contact.serviceInterest}.

  Nuestro equipo de Capital Consulting la revisará y te contactará pronto.`,
      });
    } catch {
      // Best-effort.
    }
  }
}
