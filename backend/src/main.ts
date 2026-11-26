import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { mediaDirectory } from './modules/media/image-storage';
import { buildTrustProxy } from './common/utils/request-ip.util';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('apiPrefix')!; // "api/v1"
  const [globalPrefix, version] = splitPrefix(apiPrefix); // "api", "1"

  // Passenger conecta por un socket local: sin esto `req.ip` queda vacío y
  // todos los visitantes comparten un mismo cupo de rate limiting.
  app.set('trust proxy', buildTrustProxy(process.env.TRUST_PROXY_HOPS));

  // -- Seguridad básica (Fase 11) -----------------------------------------
  app.use(helmet());
  // Helmet 8 no incluye `Permissions-Policy` por defecto (brief de
  // seguridad, sección 29). Se deshabilitan explícitamente las APIs de
  // navegador que esta API no usa; no afecta a Swagger (`/api/docs`), que no
  // depende de ninguna de ellas.
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    );
    next();
  });
  app.enableCors({
    origin: configService.get<string[]>('corsOrigins'),
    credentials: true,
  });

  // -- Imágenes públicas del CMS (Etapa 15) --------------------------------
  // Archivos ya validados por contenido real (MediaService) con nombre UUID:
  // el nombre nunca se reutiliza, así que se pueden cachear como inmutables.
  // Helmet fija `Cross-Origin-Resource-Policy: same-origin`; aquí se abre a
  // `cross-origin` solo para estas imágenes, porque las muestra el sitio
  // (otro dominio) y el optimizador de Next.js.
  app.useStaticAssets(mediaDirectory(), {
    prefix: `/${apiPrefix.replace(/^\/+|\/+$/g, '')}/media/public/`,
    index: false,
    dotfiles: 'deny',
    immutable: true,
    maxAge: '365d',
    setHeaders: (res: Response, filePath: string) => {
      // La tabla MIME de Express no conoce AVIF (lo serviría como octet-stream).
      if (filePath.toLowerCase().endsWith('.avif')) res.setHeader('Content-Type', 'image/avif');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  });

  // `POST /analytics/collect` recibe `text/plain` (sendBeacon/fetch keepalive
  // sin preflight CORS); el tamaño se limita aquí y en el DTO.
  app.useBodyParser('text', { limit: '32kb', type: 'text/plain' });

  // -- Prefijo global + versionado (Fase 1) --------------------------------
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: version,
  });

  // -- Validación global (Fase 1 / 11) -------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // -- Swagger (Fase 10) ----------------------------------------------------
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Capital Consulting and Services SAS — API')
    .setDescription(
      'API backend (NestJS) — Foundation, Auth, Users, Roles, Permissions, Admin, Chat (Yuri). ' +
        'Implementación con Repository Pattern; persistencia temporal en memoria a la ' +
        'espera del esquema PostgreSQL definitivo.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || configService.get<number>('port') || 3001;
  // Sin especificar host: Node escucha en todas las interfaces con dual-stack
  // (IPv4 + IPv6). Con '0.0.0.0' (solo IPv4) se detectó un problema real: el
  // navegador resuelve "localhost" a IPv6 (::1) primero, y si algún otro
  // proceso queda escuchando en IPv6 en ese puerto (p. ej. un `next dev`
  // suelto), se queda con las conexiones del navegador aunque el backend esté
  // sano — `curl` en este entorno usa IPv4 y por eso nunca mostraba el problema.
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`API disponible en: http://localhost:${port}/${apiPrefix}`);
  logger.log(`Swagger disponible en: http://localhost:${port}/api/docs`);
}

/** "api/v1" -> ["api", "1"] */
function splitPrefix(apiPrefix: string): [string, string] {
  const parts = apiPrefix.split('/').filter(Boolean); // ["api", "v1"]
  const globalPrefix = parts[0] ?? 'api';
  const versionPart = parts[1] ?? 'v1';
  const version = versionPart.replace(/^v/i, '') || '1';
  return [globalPrefix, version];
}

bootstrap();
