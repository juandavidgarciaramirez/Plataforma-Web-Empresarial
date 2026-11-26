import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PQR_REPOSITORY, PqrRepository } from './repositories/pqr.repository.interface';
import { CreatePqrPublicDto } from './dto/create-pqr-public.dto';
import { UpdatePqrDto } from './dto/update-pqr.dto';
import { PqrEntity } from './entities/pqr.entity';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MAILER, Mailer } from '../../common/mailer/mailer.interface';

/** Correo interno oficial de PQR (sección 21/26 del encargo). */
const PQR_INTERNAL_EMAIL = 'contacto@capitalconsulting.com.co';
const PQR_STORAGE_ROOT = process.env.FILE_STORAGE_PATH || './uploads';

let dailyCounter = 0;
let counterDay = '';

/** `PQR-YYYYMMDD-####`, correlativo por día (mismo formato que usaba el backend duplicado en Next.js). */
function nextRadicado(): string {
  const now = new Date();
  const day = now.toISOString().slice(0, 10).replace(/-/g, '');

  if (day !== counterDay) {
    counterDay = day;
    dailyCounter = 0;
  }

  dailyCounter += 1;
  return `PQR-${day}-${String(dailyCounter).padStart(4, '0')}`;
}

@Injectable()
export class PqrService {
  constructor(
    @Inject(PQR_REPOSITORY) private readonly pqrRepository: PqrRepository,
    @Inject(MAILER) private readonly mailer: Mailer,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
  ) {}

  findAll(): Promise<PqrEntity[]> {
    return this.pqrRepository.findAll();
  }

  async findOne(id: string): Promise<PqrEntity> {
    const pqr = await this.pqrRepository.findById(id);
    if (!pqr) {
      throw new NotFoundException('PQR no encontrada');
    }
    return pqr;
  }

  async findByRadicado(radicado: string): Promise<PqrEntity> {
    const pqr = await this.pqrRepository.findByRadicado(radicado);
    if (!pqr) {
      throw new NotFoundException(`No existe una PQR con el radicado ${radicado}`);
    }
    return pqr;
  }

  /**
   * Radicación pública (sección 21/26/54 del encargo). No requiere sesión.
   * Envía correo interno + confirmación al ciudadano (best-effort: un fallo
   * de correo nunca debe impedir que la PQR quede radicada — sección 65,
   * "no fingir": si no hay SMTP configurado, `ConsoleMailerService` lo deja
   * en el log, marcado como configuración pendiente).
   */
  async createPublic(dto: CreatePqrPublicDto, attachmentUrl: string | null): Promise<PqrEntity> {
    const created = await this.pqrRepository.create({
      radicado: nextRadicado(),
      type: dto.tipoSolicitud,
      fullName: dto.nombreCompleto,
      email: dto.correo,
      phone: dto.telefono || null,
      company: dto.empresa || null,
      documentType: dto.tipoDocumento ?? null,
      documentNumber: dto.numeroDocumento || null,
      subject: dto.asunto,
      description: dto.descripcion,
      attachmentUrl,
      status: 'OPEN',
      response: null,
      respondedAt: null,
    });

    this.auditService.log(dto.correo, 'pqr.create', `PQR radicada: ${created.radicado}`);

    await this.notifyCreated(created, attachmentUrl);
    await this.notificationsService.notifyByPermission('pqrs.tickets.read', {
      title: `Nueva PQR: ${created.radicado}`,
      message: `${created.type} de ${created.fullName} — ${created.subject}`,
      link: '/admin/pqr',
      type: 'INFO',
    });

    return created;
  }

  private async notifyCreated(pqr: PqrEntity, attachmentUrl: string | null): Promise<void> {
  try {
    const attachments = [];

    if (attachmentUrl) {
      const attachmentPath = join(PQR_STORAGE_ROOT, attachmentUrl);
      const content = await readFile(attachmentPath);
      const filename = attachmentUrl.split('/').pop() || 'adjunto-pqr';

      const extension = filename.split('.').pop()?.toLowerCase();
      const contentType =
        extension === 'pdf'
          ? 'application/pdf'
          : extension === 'png'
            ? 'image/png'
            : extension === 'jpg' || extension === 'jpeg'
              ? 'image/jpeg'
              : 'application/octet-stream';

      attachments.push({
        filename,
        content,
        contentType,
      });
    }

    await this.mailer.send({
      to: PQR_INTERNAL_EMAIL,
      from: PQR_INTERNAL_EMAIL,
      replyTo: pqr.email,
      subject: `Nueva PQR radicada — ${pqr.radicado}`,
      text: `Se radicó una nueva PQR.

RADICADO
${pqr.radicado}

DATOS DEL SOLICITANTE
Nombre: ${pqr.fullName}
Tipo de documento: ${pqr.documentType ?? '-'}
Número de documento: ${pqr.documentNumber ?? '-'}
Correo: ${pqr.email}
Teléfono: ${pqr.phone ?? '-'}
Empresa: ${pqr.company ?? '-'}

SOLICITUD
Tipo: ${pqr.type}
Asunto: ${pqr.subject}

DESCRIPCIÓN
${pqr.description}

ADJUNTO
${pqr.attachmentUrl ? pqr.attachmentUrl : 'No se adjuntó ningún archivo.'}`,
      attachments,
    });
  } catch {
    // Best-effort: un fallo de correo interno no debe romper la radicación.
  }

  try {
    await this.mailer.send({
      to: pqr.email,
      from: PQR_INTERNAL_EMAIL,
      subject: `Confirmación de PQR — ${pqr.radicado}`,
      text: `Hola ${pqr.fullName},

Hemos recibido correctamente tu solicitud ante Capital Consulting and Services SAS.

Tu PQR ha sido radicada con la siguiente información:

Radicado: ${pqr.radicado}

Tipo de solicitud: ${pqr.type}

Asunto: ${pqr.subject}

Conserva este número de radicado para consultar el estado de tu solicitud.

Capital Consulting gestionará tu solicitud conforme al proceso correspondiente.

Gracias por comunicarte con nosotros.`,
    });
  } catch {
    // Best-effort: un fallo de correo al ciudadano no debe romper la radicación.
  }
}

  async update(id: string, dto: UpdatePqrDto, actorEmail: string): Promise<PqrEntity> {
    await this.findOne(id);
    const updated = await this.pqrRepository.update(id, {
      ...dto,
      ...(dto.response ? { respondedAt: new Date() } : {}),
    });
    if (!updated) {
      throw new NotFoundException('PQR no encontrada');
    }
    this.auditService.log(actorEmail, 'pqr.update', `PQR actualizada: ${updated.radicado}`);
    return updated;
  }

  countOpen(): Promise<number> {
    return this.pqrRepository.countOpen();
  }

  linkAttachment(requestId: string, fileId: string): Promise<void> {
    return this.pqrRepository.linkAttachment(requestId, fileId);
  }
}
