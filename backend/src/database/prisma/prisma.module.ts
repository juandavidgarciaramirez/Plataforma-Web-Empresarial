import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global para no tener que importar `PrismaModule` en cada módulo de
 * dominio que necesite su repositorio real — mismo criterio que `ConfigModule`.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
