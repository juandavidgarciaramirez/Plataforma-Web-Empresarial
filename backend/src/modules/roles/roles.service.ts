import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_REPOSITORY, RoleRepository } from './repositories/role.repository.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository,
    private readonly auditService: AuditService,
  ) {}

  findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.findAll();
  }

  /** Uso interno (guards, otros servicios): no lanza si no existe. */
  findEntityById(id: string): Promise<RoleEntity | null> {
    return this.roleRepository.findById(id);
  }

  async findOne(id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }
    return role;
  }

  async create(dto: CreateRoleDto, actorEmail = 'system'): Promise<RoleEntity> {
    const existing = await this.roleRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }
    const created = await this.roleRepository.create({ ...dto, isSystem: false });
    this.auditService.log(actorEmail, 'roles.create', `Rol creado: ${created.name}`);
    return created;
  }

  async update(id: string, dto: UpdateRoleDto, actorEmail = 'system'): Promise<RoleEntity> {
    await this.findOne(id);
    const updated = await this.roleRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Rol no encontrado');
    }
    this.auditService.log(actorEmail, 'roles.update', `Rol actualizado: ${updated.name}`);
    return updated;
  }

  async remove(id: string, actorEmail = 'system'): Promise<void> {
    const role = await this.findOne(id);
    if (role.isSystem) {
      throw new ConflictException('No se puede eliminar un rol del sistema (seed inicial)');
    }
    await this.roleRepository.delete(id);
    this.auditService.log(actorEmail, 'roles.delete', `Rol eliminado: ${role.name}`);
  }
}
