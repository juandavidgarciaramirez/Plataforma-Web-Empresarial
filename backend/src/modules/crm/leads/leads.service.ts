import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LEAD_REPOSITORY, LeadRepository } from './repositories/lead.repository.interface';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { LeadEntity } from './entities/lead.entity';
import { AuditService } from '../../audit/audit.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { OpportunitiesService } from '../opportunities/opportunities.service';
import { SafeLogError } from '../../../common/utils/safe-error.util';

export interface UpsertFromChatInput {
  chatSessionId: string;
  name?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  service?: string | null;
  need?: string | null;
}

export interface CaptureFromWebFormInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  serviceInterest?: string | null;
  notes?: string | null;
}

/** Actor usado en la bitácora para acciones automáticas de Yuri (no hay usuario admin detrás). */
const YURI_ACTOR = 'yuri@capitalconsulting.com';
/** Actor usado en la bitácora para leads generados por el formulario público de contacto. */
const WEB_FORM_ACTOR = 'web@capitalconsulting.com';

@Injectable()
export class LeadsService {
  constructor(
    @Inject(LEAD_REPOSITORY) private readonly leadRepository: LeadRepository,
    private readonly opportunitiesService: OpportunitiesService,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(filters?: { source?: string; status?: string }): Promise<LeadEntity[]> {
    const all = await this.leadRepository.findAll();
    return all.filter(
      (lead) =>
        (!filters?.source || lead.source === filters.source) &&
        (!filters?.status || lead.status === filters.status),
    );
  }

  findEntityById(id: string): Promise<LeadEntity | null> {
    return this.leadRepository.findById(id);
  }

  async findOne(id: string): Promise<LeadEntity> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundException('Lead no encontrado');
    }
    return lead;
  }

  async create(dto: CreateLeadDto, actorEmail: string): Promise<LeadEntity> {
    const created = await this.leadRepository.create({
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      companyName: dto.companyName ?? null,
      source: dto.source ?? 'MANUAL',
      serviceInterest: dto.serviceInterest ?? null,
      status: dto.status ?? 'NEW',
      ownerUserId: dto.ownerUserId ?? null,
      notes: dto.notes ?? null,
      chatSessionId: null,
      convertedToOpportunityId: null,
    });
    this.auditService.log(actorEmail, 'leads.create', `Lead creado: ${created.name}`);
    return created;
  }

  async update(id: string, dto: UpdateLeadDto, actorEmail: string): Promise<LeadEntity> {
    await this.findOne(id);
    const updated = await this.leadRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Lead no encontrado');
    }
    this.auditService.log(actorEmail, 'leads.update', `Lead actualizado: ${updated.name}`);
    return updated;
  }

  async assign(id: string, ownerUserId: string, actorEmail: string): Promise<LeadEntity> {
    await this.findOne(id);
    const updated = await this.leadRepository.update(id, { ownerUserId });
    if (!updated) {
      throw new NotFoundException('Lead no encontrado');
    }
    this.auditService.log(actorEmail, 'leads.assign', `Lead asignado: ${updated.name}`);
    return updated;
  }

  async remove(id: string, actorEmail: string): Promise<void> {
    const lead = await this.findOne(id);
    await this.leadRepository.delete(id);
    this.auditService.log(actorEmail, 'leads.delete', `Lead eliminado: ${lead.name}`);
  }

  /** Crea una Oportunidad a partir del lead y marca el lead como CONVERTED. */
  async convert(id: string, dto: ConvertLeadDto, actorEmail: string): Promise<LeadEntity> {
    const lead = await this.findOne(id);

    const opportunity = await this.opportunitiesService.create(
      {
        title: dto.title ?? `${lead.name}${lead.companyName ? ` — ${lead.companyName}` : ''}`,
        value: dto.value ?? 0,
        companyId: dto.companyId,
        contactId: dto.contactId,
        ownerUserId: lead.ownerUserId ?? undefined,
        sourceLeadId: lead.id,
      },
      actorEmail,
    );

    const updated = await this.leadRepository.update(id, {
      status: 'CONVERTED',
      convertedToOpportunityId: opportunity.id,
    });
    if (!updated) {
      throw new NotFoundException('Lead no encontrado');
    }

    this.auditService.log(actorEmail, 'leads.convert', `Lead convertido a oportunidad: ${lead.name}`);
    return updated;
  }

  count(): Promise<number> {
    return this.leadRepository.count();
  }

  async countBySource(source: string): Promise<number> {
    const all = await this.leadRepository.findAll();
    return all.filter((l) => l.source === source).length;
  }

  async countNew(): Promise<number> {
    const all = await this.leadRepository.findAll();
    return all.filter((l) => l.status === 'NEW').length;
  }

  async groupedBySource(): Promise<{ source: string; count: number }[]> {
    const all = await this.leadRepository.findAll();
    const counts = new Map<string, number>();
    for (const lead of all) {
      counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1);
    }
    return [...counts.entries()].map(([source, count]) => ({ source, count }));
  }

  async groupedByService(): Promise<{ service: string; count: number }[]> {
    const all = await this.leadRepository.findAll();
    const counts = new Map<string, number>();
    for (const lead of all) {
      const key = lead.serviceInterest ?? 'Sin definir';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].map(([service, count]) => ({ service, count }));
  }

  /**
   * Crea o actualiza el lead asociado a una sesión de chat de Yuri
   * (Fase 16-23 del brief del chatbot). Idempotente por `chatSessionId`:
   * la misma conversación nunca genera más de un lead. Fuente = `YURI`
   * siempre, sin excepción — ver brief "YURI sigue siendo YURI".
   */
  async upsertFromChat(input: UpsertFromChatInput): Promise<LeadEntity> {
    const existing = await this.leadRepository.findByChatSessionId(input.chatSessionId);

    if (existing) {
      const updated = await this.leadRepository.update(existing.id, {
        name: input.name ?? existing.name,
        companyName: input.company ?? existing.companyName,
        email: input.email ?? existing.email,
        phone: input.phone ?? existing.phone,
        serviceInterest: input.service ?? existing.serviceInterest,
        notes: input.need ?? existing.notes,
      });
      // `update` devuelve null cuando la escritura falla: no se reporta como
      // actualizado un lead que conserva los datos anteriores.
      if (!updated) {
        throw new SafeLogError(`No se pudo actualizar el lead ${existing.id} asociado a la sesión de chat.`);
      }
      return updated;
    }

    const created = await this.leadRepository.create({
      name: input.name?.trim() || 'Visitante del sitio (Yuri)',
      email: input.email ?? null,
      phone: input.phone ?? null,
      companyName: input.company ?? null,
      source: 'YURI',
      serviceInterest: input.service ?? null,
      status: 'NEW',
      ownerUserId: null,
      notes: input.need ?? null,
      chatSessionId: input.chatSessionId,
      convertedToOpportunityId: null,
    });

    this.auditService.log(YURI_ACTOR, 'leads.create', `Lead generado por Yuri: ${created.name}`);
    return created;
  }

  /**
   * Crea un lead a partir del formulario público de Contacto (sección 31
   * del brief). A diferencia de Yuri, cada envío del formulario es un lead
   * nuevo (no hay una "sesión" con la que deduplicar). Fuente = `WEBSITE_FORM`.
   */
  async captureFromWebForm(input: CaptureFromWebFormInput): Promise<LeadEntity> {
    const created = await this.leadRepository.create({
      name: input.name.trim() || 'Contacto del sitio web',
      email: input.email ?? null,
      phone: input.phone ?? null,
      companyName: input.companyName ?? null,
      source: 'WEBSITE_FORM',
      serviceInterest: input.serviceInterest ?? null,
      status: 'NEW',
      ownerUserId: null,
      notes: input.notes ?? null,
      chatSessionId: null,
      convertedToOpportunityId: null,
    });

    this.auditService.log(WEB_FORM_ACTOR, 'leads.create', `Lead generado por formulario de contacto: ${created.name}`);
    await this.notificationsService.notifyByPermission('crm.leads.read', {
      title: 'Nuevo lead desde el sitio web',
      message: `${created.name}${created.companyName ? ' — ' + created.companyName : ''}`,
      link: '/admin/crm/leads',
      type: 'INFO',
    });
    return created;
  }
}
