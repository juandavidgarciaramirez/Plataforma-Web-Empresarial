import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { APPLICATION_REPOSITORY, ApplicationRepository } from './repositories/application.repository.interface';
import { CreateApplicationPublicDto } from './dto/create-application-public.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationEntity } from './entities/application.entity';
import { AuditService } from '../../audit/audit.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { VacanciesService } from '../vacancies/vacancies.service';
import { MAILER, Mailer } from '../../../common/mailer/mailer.interface';
import { DATA_POLICY_VERSION, MAIN_CONSENT_PARAGRAPHS } from './consent-policy.constants';

/** Correo interno oficial de Careers/Talento Humano (sección 23/26 del encargo). NUNCA el comercial. */
const PEOPLE_AND_CULTURE_EMAIL = 'peopleandculture@capitalconsulting.com.co';

export interface CreatePublicApplicationMeta {
  ip: string;
  cvFile: { url: string; fileName: string; sizeBytes: number; mimeType: string; fileId?: string };
}

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger('ApplicationsService');

  constructor(
    @Inject(APPLICATION_REPOSITORY) private readonly applicationRepository: ApplicationRepository,
    private readonly auditService: AuditService,
    private readonly vacanciesService: VacanciesService,
    @Inject(MAILER) private readonly mailer: Mailer,
    private readonly notificationsService: NotificationsService,
  ) {}

  findAll(): Promise<ApplicationEntity[]> {
    return this.applicationRepository.findAll();
  }

  async findOne(id: string): Promise<ApplicationEntity> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundException('Postulación no encontrada');
    }
    return application;
  }

  async update(id: string, dto: UpdateApplicationDto, actorEmail: string): Promise<ApplicationEntity> {
    await this.findOne(id);
    const updated = await this.applicationRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Postulación no encontrada');
    }
    this.auditService.log(actorEmail, 'careers.update', `Postulación actualizada: ${updated.fullName}`);
    return updated;
  }

  countRecent(days = 30): Promise<number> {
    return this.applicationRepository.countRecent(days);
  }

  /**
   * Postulación pública a la Base de Altos Potenciales (secciones 23/24/26/55
   * del encargo). No requiere sesión. Registra evidencia de consentimiento
   * (IP, fecha, versión de política, texto exacto aceptado) y notifica a
   * People & Culture + confirmación al candidato (sin adjuntar la hoja de
   * vida completa, sección 26).
   */
  async createPublic(dto: CreateApplicationPublicDto, meta: CreatePublicApplicationMeta): Promise<ApplicationEntity> {
    let vacancyId: string | null = null;
    let vacancyTitle = dto.cargoAspirado;

    if (dto.vacanteSlug) {
      const vacancies = await this.vacanciesService.findAll();
      const vacancy = vacancies.find((v) => v.slug === dto.vacanteSlug);
      if (vacancy) {
        vacancyId = vacancy.id;
        vacancyTitle = vacancy.title;
      }
    }

    const created = await this.applicationRepository.create({
      vacancyId,
      vacancyTitle,
      fullName: dto.nombreCompleto,
      email: dto.correo,
      phone: dto.celular,
      cvUrl: meta.cvFile.url,
      cvFileId: meta.cvFile.fileId ?? null,
      message: null,
      status: 'RECEIVED',
      documentType: dto.tipoDocumento,
      documentNumber: dto.numeroDocumento,
      city: dto.ciudadPais,
      experienceRange: dto.aniosExperiencia,
      educationLevel: dto.nivelEducativo,
      relocation: dto.disponibilidad,
      linkedin: dto.linkedin || null,
      salaryExpectation: dto.aspiracionSalarial || null,
      referralSource: dto.comoSeEntero || null,
      sectors: dto.sectores,
      cvFileName: meta.cvFile.fileName,
      cvSizeBytes: meta.cvFile.sizeBytes,
      cvMimeType: meta.cvFile.mimeType,
      consent: {
        timestamp: new Date(),
        ip: meta.ip,
        policyVersion: DATA_POLICY_VERSION,
        consentText: MAIN_CONSENT_PARAGRAPHS.join('\n\n'),
        dataConsent: dto.autorizacionDatos,
        communicationsConsent: dto.autorizacionComunicaciones ?? false,
        shareCvConsent: dto.autorizacionCompartirHV ?? false,
      },
    });

    this.auditService.log(dto.correo, 'careers.create', `Postulación recibida: ${created.fullName}`);

    await this.notifyCreated(created);
    await this.notificationsService.notifyByPermission('jobs.applications.read', {
      title: 'Nueva postulación recibida',
      message: `${created.fullName} — ${created.vacancyTitle}`,
      link: '/admin/careers',
      type: 'INFO',
    });

    return created;
  }

  private async notifyCreated(application: ApplicationEntity): Promise<void> {
    try {
      await this.mailer.send({
        to: PEOPLE_AND_CULTURE_EMAIL,
        subject: `Nueva postulación — ${application.vacancyTitle}`,
        text: `Candidato: ${application.fullName} (${application.email})\nCargo: ${application.vacancyTitle}\nCiudad/país: ${application.city}\nExperiencia: ${application.experienceRange}\n\nHoja de vida: ${application.cvUrl}`,
      });
    } catch (error) {
      this.logger.error('No se pudo enviar el correo interno de la postulación', error as Error);
    }

    try {
      await this.mailer.send({
        to: application.email,
        subject: 'Recibimos tu postulación — Capital Consulting',
        text: `Hola ${application.fullName},\n\nRecibimos correctamente tu postulación para:\n\n${application.vacancyTitle}\n\nTu perfil ha sido registrado en nuestra Base de Altos Potenciales.`,
      });
    } catch (error) {
      this.logger.error('No se pudo enviar el correo de confirmación al candidato', error as Error);
    }
  }
}
