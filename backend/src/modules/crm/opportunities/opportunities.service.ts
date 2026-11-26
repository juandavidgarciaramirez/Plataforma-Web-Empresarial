import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OPPORTUNITY_REPOSITORY, OpportunityRepository } from './repositories/opportunity.repository.interface';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { CloseOpportunityDto } from './dto/close-opportunity.dto';
import {
  CLOSED_STAGES,
  OPPORTUNITY_STAGES,
  OpportunityEntity,
  OpportunityStage,
} from './entities/opportunity.entity';
import { AuditService } from '../../audit/audit.service';

export interface PipelineColumn {
  stage: OpportunityStage;
  count: number;
  totalValue: number;
  opportunities: OpportunityEntity[];
}

@Injectable()
export class OpportunitiesService {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY) private readonly opportunityRepository: OpportunityRepository,
    private readonly auditService: AuditService,
  ) {}

  async findAll(stage?: OpportunityStage): Promise<OpportunityEntity[]> {
    const all = await this.opportunityRepository.findAll();
    return stage ? all.filter((o) => o.stage === stage) : all;
  }

  findEntityById(id: string): Promise<OpportunityEntity | null> {
    return this.opportunityRepository.findById(id);
  }

  async findOne(id: string): Promise<OpportunityEntity> {
    const opportunity = await this.opportunityRepository.findById(id);
    if (!opportunity) {
      throw new NotFoundException('Oportunidad no encontrada');
    }
    return opportunity;
  }

  async create(dto: CreateOpportunityDto, actorEmail: string): Promise<OpportunityEntity> {
    const created = await this.opportunityRepository.create({
      title: dto.title,
      companyId: dto.companyId ?? null,
      contactId: dto.contactId ?? null,
      value: dto.value ?? 0,
      currency: dto.currency ?? 'COP',
      stage: dto.stage ?? 'NEW',
      probability: dto.probability ?? null,
      ownerUserId: dto.ownerUserId ?? null,
      expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : null,
      sourceLeadId: dto.sourceLeadId ?? null,
      closedAt: null,
      closeReason: null,
    });
    this.auditService.log(actorEmail, 'opportunities.create', `Oportunidad creada: ${created.title}`);
    return created;
  }

  async update(id: string, dto: UpdateOpportunityDto, actorEmail: string): Promise<OpportunityEntity> {
    await this.findOne(id);
    const updated = await this.opportunityRepository.update(id, {
      ...dto,
      expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
    });
    if (!updated) {
      throw new NotFoundException('Oportunidad no encontrada');
    }
    this.auditService.log(actorEmail, 'opportunities.update', `Oportunidad actualizada: ${updated.title}`);
    return updated;
  }

  async assign(id: string, ownerUserId: string, actorEmail: string): Promise<OpportunityEntity> {
    await this.findOne(id);
    const updated = await this.opportunityRepository.update(id, { ownerUserId });
    if (!updated) {
      throw new NotFoundException('Oportunidad no encontrada');
    }
    this.auditService.log(actorEmail, 'opportunities.assign', `Oportunidad asignada: ${updated.title}`);
    return updated;
  }

  async changeStage(id: string, stage: OpportunityStage, actorEmail: string): Promise<OpportunityEntity> {
    const existing = await this.findOne(id);
    const updated = await this.opportunityRepository.update(id, {
      stage,
      ...(CLOSED_STAGES.includes(stage) ? { closedAt: new Date() } : {}),
    });
    if (!updated) {
      throw new NotFoundException('Oportunidad no encontrada');
    }
    this.auditService.log(
      actorEmail,
      'opportunities.changeStage',
      `Oportunidad "${existing.title}": ${existing.stage} → ${stage}`,
    );
    return updated;
  }

  async close(id: string, dto: CloseOpportunityDto, actorEmail: string): Promise<OpportunityEntity> {
    const existing = await this.findOne(id);
    const updated = await this.opportunityRepository.update(id, {
      stage: dto.outcome,
      closedAt: new Date(),
      closeReason: dto.reason ?? null,
    });
    if (!updated) {
      throw new NotFoundException('Oportunidad no encontrada');
    }
    this.auditService.log(
      actorEmail,
      'opportunities.close',
      `Oportunidad cerrada (${dto.outcome}): ${existing.title}`,
    );
    return updated;
  }

  async remove(id: string, actorEmail: string): Promise<void> {
    const opportunity = await this.findOne(id);
    await this.opportunityRepository.delete(id);
    this.auditService.log(actorEmail, 'opportunities.delete', `Oportunidad eliminada: ${opportunity.title}`);
  }

  count(): Promise<number> {
    return this.opportunityRepository.count();
  }

  async countOpen(): Promise<number> {
    const all = await this.opportunityRepository.findAll();
    return all.filter((o) => !CLOSED_STAGES.includes(o.stage)).length;
  }

  async openPipelineValue(): Promise<number> {
    const all = await this.opportunityRepository.findAll();
    return all.filter((o) => !CLOSED_STAGES.includes(o.stage)).reduce((sum, o) => sum + o.value, 0);
  }

  /** Agrupa las oportunidades por etapa para el tablero Kanban y el gráfico "pipeline por etapa". */
  async getPipelineBoard(): Promise<PipelineColumn[]> {
    const all = await this.opportunityRepository.findAll();
    return OPPORTUNITY_STAGES.map((stage) => {
      const opportunities = all.filter((o) => o.stage === stage);
      return {
        stage,
        count: opportunities.length,
        totalValue: opportunities.reduce((sum, o) => sum + o.value, 0),
        opportunities,
      };
    });
  }
}
