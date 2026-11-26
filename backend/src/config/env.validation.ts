import { plainToInstance } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Forma tipada y validada de `process.env`.
 *
 * `ConfigModule.forRoot({ validate })` ejecuta esto una sola vez al arrancar
 * la aplicación: si falta o es inválida una variable requerida, el proceso
 * falla rápido con un mensaje claro en vez de fallar más adelante en tiempo
 * de ejecución (p. ej. firmando JWT con `undefined`).
 */
class EnvironmentVariables {
  @IsIn([NodeEnv.Development, NodeEnv.Production, NodeEnv.Test])
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  PORT: number = 3001;

  @IsString()
  @IsOptional()
  API_PREFIX: string = 'api/v1';

  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = 'http://localhost:3000';

  @IsString()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @IsOptional()
  JWT_ACCESS_EXPIRES_IN: string = '15m';

  @IsString()
  JWT_REFRESH_SECRET!: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN: string = '7d';

  @IsInt()
  @IsOptional()
  THROTTLE_TTL: number = 60;

  @IsInt()
  @IsOptional()
  THROTTLE_LIMIT: number = 100;

  @IsString()
  @IsOptional()
  SEED_ADMIN_EMAIL?: string;

  @IsString()
  @IsOptional()
  SEED_ADMIN_PASSWORD?: string;

  @IsString()
  @IsOptional()
  FRONTEND_URL: string = 'http://localhost:3000';

  @IsString()
  @IsOptional()
  PASSWORD_RESET_EXPIRES_IN: string = '1h';

  @IsInt()
  @IsOptional()
  LOGIN_MAX_ATTEMPTS: number = 5;

  @IsInt()
  @IsOptional()
  LOGIN_LOCKOUT_MINUTES: number = 15;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join(' | ');
    throw new Error(`Configuración de entorno inválida: ${messages}`);
  }

  return validatedConfig;
}
