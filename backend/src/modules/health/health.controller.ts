import { Controller, Get, HttpCode, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../database/prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Estado de salud de la API' })
  check() {
    return {
      status: 'ok',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: this.configService.get<string>('nodeEnv'),
    };
  }

  /** Liveness: el proceso está corriendo. No depende de nada externo (Kubernetes/orquestador). */
  @Public()
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe: el proceso está vivo' })
  live() {
    return { status: 'ok' };
  }

  /** Readiness: el proceso puede atender tráfico (la base de datos responde). */
  @Public()
  @Get('ready')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Readiness probe: la API puede atender tráfico (incluye conexión a PostgreSQL)' })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'up' };
    } catch {
      throw new ServiceUnavailableException({ status: 'error', database: 'down' });
    }
  }
}
