import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../modules/users/users.module';
import { RolesModule } from '../modules/roles/roles.module';

/**
 * Etapa 4 (2026-08-26): `CrmSeedService` (datos demo del CRM: 3 empresas,
 * 5 contactos, 8 leads, 4 oportunidades marcados "(Demo)") se retiró de
 * aquí al conectar Companies/Contacts/Leads/Opportunities a PostgreSQL
 * real — sembrar datos de demostración en `jud_platform_dev` violaría la
 * regla de "no mocks en producción" (sección 65 del encargo). El archivo
 * se conserva (`crm-seed.service.ts`) solo como referencia histórica del
 * shape de datos usado en memoria; ya no se registra como provider.
 */
@Module({
  imports: [UsersModule, RolesModule],
  providers: [SeedService],
})
export class SeedModule {}
