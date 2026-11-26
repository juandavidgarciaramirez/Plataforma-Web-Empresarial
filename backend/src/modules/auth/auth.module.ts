import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AUTH_REPOSITORY } from './repositories/auth.repository.interface';
import { PrismaAuthRepository } from './repositories/prisma-auth.repository';
import { PASSWORD_RESET_REPOSITORY } from './repositories/password-reset.repository.interface';
import { PrismaPasswordResetRepository } from './repositories/prisma-password-reset.repository';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { MailerModule } from '../../common/mailer/mailer.module';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    MailerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: config.get<string>('jwt.accessExpiresIn') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: AUTH_REPOSITORY, useClass: PrismaAuthRepository },
    { provide: PASSWORD_RESET_REPOSITORY, useClass: PrismaPasswordResetRepository },
    // Guards globales: se aplican a TODA la API (usuario → rol → permiso).
    // Orden importa: primero autentica (JwtAuthGuard adjunta request.user),
    // luego valida rol y permisos sobre ese request.user.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
