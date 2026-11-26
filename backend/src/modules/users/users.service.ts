import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { USER_REPOSITORY, UserRepository } from './repositories/user.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SafeUser, UserEntity } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { AuditService } from '../audit/audit.service';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
    private readonly auditService: AuditService,
  ) {}

  async toSafeUser(user: UserEntity): Promise<SafeUser> {
    const role = await this.rolesService.findEntityById(user.roleId);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      roleName: role?.name ?? 'DESCONOCIDO',
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.findAll();
    return Promise.all(users.map((u) => this.toSafeUser(u)));
  }

  /** Uso interno (guards, AuthService): devuelve la entidad completa (con hash) o null. */
  findEntityById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  findEntityByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.toSafeUser(user);
  }

  async create(dto: CreateUserDto, actorEmail = 'system'): Promise<SafeUser> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese correo electrónico');
    }

    const role = await this.rolesService.findEntityById(dto.roleId);
    if (!role) {
      throw new BadRequestException('roleId no corresponde a un rol existente');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const created = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      passwordHash,
      roleId: dto.roleId,
      status: dto.status ?? 'ACTIVE',
      lastLogin: null,
    });

    this.auditService.log(actorEmail, 'users.create', `Usuario creado: ${dto.email}`);

    return this.toSafeUser(created);
  }

  async update(id: string, dto: UpdateUserDto, actorEmail = 'system'): Promise<SafeUser> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.email && dto.email.toLowerCase() !== existing.email.toLowerCase()) {
      const emailTaken = await this.userRepository.findByEmail(dto.email);
      if (emailTaken) {
        throw new ConflictException('Ya existe un usuario con ese correo electrónico');
      }
    }

    if (dto.roleId) {
      const role = await this.rolesService.findEntityById(dto.roleId);
      if (!role) {
        throw new BadRequestException('roleId no corresponde a un rol existente');
      }
    }

    const passwordHash = dto.password ? await bcrypt.hash(dto.password, SALT_ROUNDS) : undefined;

    const updated = await this.userRepository.update(id, {
      ...(dto.name && { name: dto.name }),
      ...(dto.email && { email: dto.email }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.roleId && { roleId: dto.roleId }),
      ...(dto.status && { status: dto.status }),
      ...(passwordHash && { passwordHash }),
    });

    if (!updated) {
      throw new NotFoundException('Usuario no encontrado');
    }

    this.auditService.log(actorEmail, 'users.update', `Usuario actualizado: ${updated.email}`);

    return this.toSafeUser(updated);
  }

  /** Registra el momento del último login exitoso (sección 15 del brief). No genera entrada de auditoría: es rutina. */
  async recordLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLogin: new Date() });
  }

  async remove(id: string, actorEmail = 'system'): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.userRepository.delete(id);
    this.auditService.log(actorEmail, 'users.delete', `Usuario eliminado: ${existing.email}`);
  }

  count(): Promise<number> {
    return this.userRepository.count();
  }
}
