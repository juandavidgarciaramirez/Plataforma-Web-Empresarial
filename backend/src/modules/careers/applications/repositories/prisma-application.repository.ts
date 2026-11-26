import { Injectable } from '@nestjs/common';
// OJO: el cliente real se genera en `prisma/generated` (no en el paquete `@prisma/client`
// por defecto — ver `PrismaService`). Para tipos puros (`Prisma.JsonValue`) da igual de dónde
// se importe, pero para clases usadas en runtime (`instanceof Prisma.PrismaClientKnownRequestError`)
// hay que importar del cliente real: son instancias de módulos distintos si no.
import { Prisma } from '../../../../../prisma/generated';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { ApplicationEntity, ApplicationStatus } from '../entities/application.entity';
import { ApplicationRepository } from './application.repository.interface';
import { splitFullName } from '../../../../common/utils/name.util';
import { GENERAL_TALENT_POOL_CODE } from '../../vacancies/repositories/prisma-vacancy.repository';

const APPLICATION_INCLUDE = {
  candidates: true,
  job_positions: { select: { id: true, code: true, title: true } },
  files: { select: { id: true, original_name: true, size_bytes: true, mime_type: true } },
} as const;

type ApplicationRow = Prisma.applicationsGetPayload<{ include: typeof APPLICATION_INCLUDE }>;

/**
 * Implementación real sobre `careers.applications` + `careers.candidates`
 * (Etapa 14 — existían desde antes, ApplicationsModule usaba
 * InMemoryApplicationRepository, hallazgo de la Etapa 13).
 *
 * Etapa 15: el candidato se deduplica por correo (`findOrUpdateCandidate`)
 * en vez de crear una fila nueva en cada postulación — así una misma
 * persona que se postula varias veces queda como un único perfil en
 * `careers.candidates`, con los datos siempre actualizados a lo último que
 * envió. `careers.applications` tiene `UNIQUE(candidate_id,
 * job_position_id)` (incluida la vacante placeholder de la Base de Altos
 * Potenciales): si el mismo candidato vuelve a postularse a la misma
 * vacante (o de nuevo a la Base de Altos Potenciales sin vacante puntual),
 * se trata como una re-postulación — se actualiza la fila existente
 * (estado, CV, evidencia de consentimiento, fecha) en vez de fallar por la
 * restricción única o crear un duplicado.
 */
@Injectable()
export class PrismaApplicationRepository implements ApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ApplicationEntity[]> {
    const rows = await this.prisma.applications.findMany({
      include: APPLICATION_INCLUDE,
      orderBy: { applied_at: 'desc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<ApplicationEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    const row = await this.prisma.applications.findUnique({ where: { id: bigintId }, include: APPLICATION_INCLUDE });
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<ApplicationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApplicationEntity> {
    const jobPositionId = await this.resolveJobPositionId(data.vacancyId);
    const candidateId = await this.findOrUpdateCandidate(data);
    const desiredPosition =
      jobPositionId === (await this.resolveGeneralTalentPoolId()) ? data.vacancyTitle : null;

    const applicationData = {
  notes: data.message,
  status: data.status,
  source: 'WEBSITE_FORM',
};

    try {
      const row = await this.prisma.applications.create({
        data: { job_position_id: jobPositionId, candidate_id: candidateId, ...applicationData },
        include: APPLICATION_INCLUDE,
      });
      return this.toEntity(row);
    } catch (err) {
      // P2002 = violación de UNIQUE(candidate_id, job_position_id): el mismo candidato ya se
      // había postulado a esta vacante (o a la Base de Altos Potenciales) — se trata como
      // re-postulación: se actualiza la fila existente en vez de fallar o duplicar.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const row = await this.prisma.applications.update({
          where: { candidate_id_job_position_id: { candidate_id: candidateId, job_position_id: jobPositionId } },
          data: { ...applicationData, applied_at: new Date(), updated_at: new Date() },
          include: APPLICATION_INCLUDE,
        });
        return this.toEntity(row);
      }
      throw err;
    }
  }

  /** Busca un candidato real por correo (case-insensitive); si existe, actualiza sus datos con lo último enviado; si no, lo crea. */
  private async findOrUpdateCandidate(data: Omit<ApplicationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<bigint> {
    const { firstName, lastName } = splitFullName(data.fullName);
    const candidateData = {
  first_name: firstName,
  last_name: lastName || firstName,
  mobile_phone: data.phone,
  identification_type: data.documentType,
  identification_number: data.documentNumber,
  linkedin_url: data.linkedin,
  professional_summary: data.salaryExpectation,
  ...(data.consent && {
    consent_data_processing: data.consent.dataConsent,
    consent_date: new Date(),
  }),
};
    const existing = await this.prisma.candidates.findFirst({
      where: { email: { equals: data.email, mode: 'insensitive' } },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.candidates.update({ where: { id: existing.id }, data: candidateData });
      return existing.id;
    }

    const created = await this.prisma.candidates.create({
      data: {
        ...candidateData,
        email: data.email,
        consent_data_processing: data.consent?.dataConsent ?? false,
        consent_date: data.consent ? new Date() : null,
        status: 'ACTIVE',
      },
      select: { id: true },
    });
    return created.id;
  }

  async update(
    id: string,
    data: Partial<Omit<ApplicationEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ApplicationEntity | null> {
    const bigintId = this.toBigInt(id);
    if (bigintId === null) return null;
    try {
      const row = await this.prisma.applications.update({
        where: { id: bigintId },
        data: {
          ...(data.status !== undefined && { status: data.status }),
          ...(data.message !== undefined && { notes: data.message }),
          updated_at: new Date(),
        },
        include: APPLICATION_INCLUDE,
      });
      return this.toEntity(row);
    } catch {
      return null;
    }
  }

  async countRecent(days: number): Promise<number> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.prisma.applications.count({ where: { applied_at: { gte: since } } });
  }

  private generalTalentPoolIdCache: bigint | null = null;
  private async resolveGeneralTalentPoolId(): Promise<bigint> {
    if (this.generalTalentPoolIdCache) return this.generalTalentPoolIdCache;
    const row = await this.prisma.job_positions.findFirst({
      where: { code: GENERAL_TALENT_POOL_CODE },
      select: { id: true },
    });
    if (!row) {
      throw new Error(
        `No existe la vacante placeholder "${GENERAL_TALENT_POOL_CODE}" — falta ejecutar database/migrations/010_pqr_careers_real_persistence.sql.`,
      );
    }
    this.generalTalentPoolIdCache = row.id;
    return row.id;
  }

  /** Resuelve `vacancyId` (id real ya conocido por ApplicationsService) al placeholder si no viene. */
  private async resolveJobPositionId(vacancyId: string | null): Promise<bigint> {
    if (vacancyId) {
      const bigintId = this.toBigInt(vacancyId);
      if (bigintId !== null) return bigintId;
    }
    return this.resolveGeneralTalentPoolId();
  }

  private toEntity(row: ApplicationRow): ApplicationEntity {
    const entity = new ApplicationEntity();
    entity.id = row.id.toString();
    const isGeneralPool = row.job_positions.code === GENERAL_TALENT_POOL_CODE;
    entity.vacancyId = isGeneralPool ? null : row.job_positions.id.toString();
    entity.vacancyTitle = isGeneralPool ? (row.desired_position ?? row.job_positions.title) : row.job_positions.title;
    entity.fullName = [row.candidates.first_name, row.candidates.last_name].filter(Boolean).join(' ');
    entity.email = row.candidates.email;
    entity.phone = row.candidates.mobile_phone;
    entity.cvUrl = row.files ? `/files/${row.files.id}/download` : null;
    entity.message = row.notes;
    entity.status = row.status as ApplicationStatus;
    entity.createdAt = row.created_at ?? new Date(0);
    entity.updatedAt = row.updated_at ?? new Date(0);
    entity.documentType = row.candidates.identification_type;
    entity.documentNumber = row.candidates.identification_number;
    entity.city = '';
    entity.educationLevel = '';
    entity.relocation = '';
    entity.salaryExpectation = '';
    entity.referralSource = '';
    entity.sectors = [];
    
    entity.cvFileName = row.files?.original_name ?? null;
    entity.cvSizeBytes = row.files?.size_bytes ? Number(row.files.size_bytes) : null;
    entity.cvMimeType = row.files?.mime_type ?? null;
    entity.consent =
      row.consent_policy_version || row.candidates.consent_data_processing
        ? {
            timestamp: row.candidates.consent_date ?? row.created_at ?? new Date(0),
            ip: row.consent_ip ?? '',
            policyVersion: row.consent_policy_version ?? '',
            consentText: row.consent_text ?? '',
            dataConsent: row.candidates.consent_data_processing,
            communicationsConsent: row.consent_communications,
            shareCvConsent: row.consent_share_cv,
          }
        : null;
    return entity;
  }

  private toBigInt(id: string): bigint | null {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }

  private toBigIntOrNull(id: string | null | undefined): bigint | null {
    if (!id) return null;
    return this.toBigInt(id);
  }
}
