import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../modules/users/users.service';
import { RolesService } from '../modules/roles/roles.service';

/**
 * Seed de arranque (solo seguridad): crea el usuario administrador
 * (`SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`) si todavía no existe. Nunca inserta
 * datos comerciales: los catálogos del CRM los define la migración 015 y los
 * datos de demostración no se ejecutan (ver database/docs/CRM_PRODUCTION_BOOTSTRAP.md).
 *
 * Etapa 2 (2026-08-26): con `PrismaRoleRepository`/`PrismaUserRepository`
 * conectados a `jud_platform_dev`, el rol con acceso total se llama
 * `Administrador` (no `SUPER_ADMIN` — ese nombre era del seed en memoria).
 * Este seed NO toca los 2 usuarios de plantilla que ya existían en la base
 * (`admin@judplatform.com`, `adminin`) — solo crea uno nuevo si el email de
 * `SEED_ADMIN_EMAIL` todavía no está registrado. Ver
 * database/docs/MIGRATION_LOG.md (Etapa 2) y docs/backend-audit.md.
 */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger('Seed');

  /** Nombre real del rol con acceso total en `security.roles` (Etapa 2). */
  private static readonly ADMIN_ROLE_NAME = 'Administrador';

  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.configService.get<string>('seedAdmin.email')?.trim();
    const password = this.configService.get<string>('seedAdmin.password');

    if (!email) {
      this.logger.warn('SEED_ADMIN_EMAIL no está definido: se omite el seed y los leads automáticos no podrán asignarse.');
      return;
    }

    const existing = await this.usersService.findEntityByEmail(email);
    if (existing) {
      this.logger.log('El usuario administrador ya existe, se omite el seed.');
      return;
    }

    if (!password) {
      this.logger.warn('SEED_ADMIN_PASSWORD no está definido: no se crea el usuario administrador.');
      return;
    }

    const roles = await this.rolesService.findAll();
    const adminRole = roles.find((r) => r.name === SeedService.ADMIN_ROLE_NAME);

    if (!adminRole) {
      this.logger.error(
        `No se encontró el rol "${SeedService.ADMIN_ROLE_NAME}"; no se pudo crear el usuario seed.`,
      );
      return;
    }

    await this.usersService.create({
      name: this.configService.get<string>('SEED_ADMIN_NAME')?.trim() || 'Administrador del sistema',
      email,
      password,
      roleId: adminRole.id,
      status: 'ACTIVE',
    });

    this.logger.log('Usuario administrador creado.');
  }
}
