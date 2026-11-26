import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TEAM_MEMBER_REPOSITORY, TeamMemberRepository } from './repositories/team-member.repository.interface';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMemberEntity } from './entities/team-member.entity';
import { AuditService } from '../../audit/audit.service';
import { MediaService } from '../../media/media.service';
import { MediaImage } from '../../media/media.types';
import { RequestUser } from '../../../common/interfaces/authenticated-request.interface';

type Actor = Pick<RequestUser, 'id' | 'email'>;

@Injectable()
export class TeamMembersService {
  constructor(
    @Inject(TEAM_MEMBER_REPOSITORY) private readonly teamMemberRepository: TeamMemberRepository,
    private readonly auditService: AuditService,
    private readonly mediaService: MediaService,
  ) {}

  async findAll(): Promise<TeamMemberEntity[]> {
    return this.withPhotoFiles(await this.teamMemberRepository.findAll());
  }

  async findOne(id: string): Promise<TeamMemberEntity> {
    const member = await this.teamMemberRepository.findById(id);
    if (!member) {
      throw new NotFoundException('Integrante del equipo no encontrado');
    }
    const [withPhoto] = await this.withPhotoFiles([member]);
    return withPhoto;
  }

  async create(dto: CreateTeamMemberDto, actor: Actor): Promise<TeamMemberEntity> {
    const photo = await this.mediaService.resolvePrimary(dto.photoFileId);
    const created = await this.teamMemberRepository.create({
      name: dto.name,
      position: dto.position,
      bio: dto.bio ?? null,
      photoUrl: photo?.url ?? dto.photoUrl ?? null,
      photoAlt: dto.photoAlt ?? null,
      order: dto.order ?? 0,
      status: dto.status ?? 'ACTIVE',
      profession: dto.profession ?? null,
      area: dto.area ?? null,
      serviceCode: dto.serviceCode ?? null,
      specialties: dto.specialties ?? [],
      certifications: dto.certifications ?? null,
      certificationsLabel: dto.certificationsLabel ?? null,
      isTransversal: dto.isTransversal ?? false,
      orgLevel: dto.orgLevel ?? null,
      parentId: dto.parentId ?? null,
      connectorCurve: dto.connectorCurve ?? null,
    });
    await this.syncPhoto(created.id, photo, dto.photoAlt ?? null, actor);
    this.auditService.log(actor.email, 'team.create', `Integrante del equipo creado: ${created.name}`);
    return this.findOne(created.id);
  }

  async update(id: string, dto: UpdateTeamMemberDto, actor: Actor): Promise<TeamMemberEntity> {
    const existing = await this.findOne(id);
    const { photoFileId, ...fields } = dto;
    const photo = await this.mediaService.resolvePrimary(photoFileId);
    const updated = await this.teamMemberRepository.update(id, {
      ...fields,
      ...(photo !== undefined && { photoUrl: photo?.url ?? null }),
    });
    if (!updated) {
      throw new NotFoundException('Integrante del equipo no encontrado');
    }
    await this.syncPhoto(id, photo, dto.photoAlt ?? existing.photoAlt, actor);
    this.auditService.log(actor.email, 'team.update', `Integrante del equipo actualizado: ${updated.name}`);
    return this.findOne(id);
  }

  async remove(id: string, actor: Actor): Promise<void> {
    const member = await this.findOne(id);
    // La fotografía se suelta solo si el integrante realmente se eliminó.
    if (await this.teamMemberRepository.delete(id)) await this.mediaService.releaseEntity('team', id, actor.email);
    this.auditService.log(actor.email, 'team.delete', `Integrante del equipo eliminado: ${member.name}`);
  }

  private async syncPhoto(id: string, photo: MediaImage | null | undefined, alt: string | null, actor: Actor): Promise<void> {
    if (photo === undefined) return;
    await this.mediaService.setSlot('team', id, 'photo', photo ? [{ fileId: photo.fileId, alt: alt ?? undefined }] : [], actor);
  }

  private async withPhotoFiles(items: TeamMemberEntity[]): Promise<TeamMemberEntity[]> {
    const images = await this.mediaService.loadForEntities(
      'team',
      items.map((item) => item.id),
    );
    for (const item of items) {
      item.photoFileId = images.get(item.id)?.photo?.[0]?.fileId ?? null;
    }
    return items;
  }
}
