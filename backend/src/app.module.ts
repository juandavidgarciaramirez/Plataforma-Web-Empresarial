import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HealthModule } from './modules/health/health.module';
import { AuditModule } from './modules/audit/audit.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { ChatModule } from './modules/chat/chat.module';
import { CrmModule } from './modules/crm/crm.module';
import { ContentModule } from './modules/content/content.module';
import { PqrModule } from './modules/pqr/pqr.module';
import { CareersModule } from './modules/careers/careers.module';
import { ContactModule } from './modules/contacts/contact.module';
import { FilesModule } from './modules/files/files.module';
import { MediaModule } from './modules/media/media.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SeedModule } from './database/seed.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { PrismaService } from './database/prisma/prisma.service';
import { PostgresThrottlerStorage } from './common/throttler/postgres-throttler.storage';
import { rateLimitIdentity } from './common/utils/request-ip.util';
import { MigrationModule } from './database/migrations/migration.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validate,
      load: [configuration],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService, PrismaService],
      useFactory: (config: ConfigService, prisma: PrismaService) => ({
        throttlers: [{ ttl: config.get<number>('throttle.ttl')! * 1000, limit: config.get<number>('throttle.limit')! }],
        // Contador atómico y compartido entre las instancias de Passenger.
        storage: new PostgresThrottlerStorage(prisma, config.get<string>('jwt.accessSecret')!),
        getTracker: (request: Record<string, any>) => rateLimitIdentity(request.ip),
      }),
    }),
    PrismaModule,
    AuditModule,
    HealthModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    AuthModule,
    AdminModule,
    ChatModule,
    CrmModule,
    ContentModule,
    PqrModule,
    CareersModule,
    ContactModule,
    FilesModule,
    MediaModule,
    AnalyticsModule,
    SettingsModule,
    NotificationsModule,
    SeedModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
