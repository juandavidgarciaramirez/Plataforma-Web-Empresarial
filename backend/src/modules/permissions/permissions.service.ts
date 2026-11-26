import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PERMISSION_REPOSITORY, PermissionRepository } from './repositories/permission.repository.interface';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionEntity } from './entities/permission.entity';
import { ROLE_REPOSITORY, RoleRepository } from '../roles/repositories/role.repository.interface';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: PermissionRepository,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository,
  ) {}

  findAll(): Promise<PermissionEntity[]> {
    return this.permissionRepository.findAll();
  }

  async findOne(id: string): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permiso no encontrado');
    }
    return permission;
  }

  async create(dto: CreatePermissionDto): Promise<PermissionEntity> {
    const existing = await this.permissionRepository.findByKey(dto.key);
    if (existing) {
      throw new ConflictException('Ya existe un permiso con esa clave');
    }
    return this.permissionRepository.create(dto);
  }

  async update(id: string, dto: UpdatePermissionDto): Promise<PermissionEntity> {
    await this.findOne(id);
    const updated = await this.permissionRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Permiso no encontrado');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    const roles = await this.roleRepository.findAll();
    const inUse = roles.some((role) => role.permissionKeys.includes(permission.key));

    if (inUse) {
      throw new ConflictException('No se puede eliminar: el permiso está asignado a uno o más roles');
    }

    await this.permissionRepository.delete(id);
  }
}
