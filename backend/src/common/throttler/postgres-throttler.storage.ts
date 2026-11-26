import { Logger } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { createHmac } from 'crypto';
import { PrismaService } from '../../database/prisma/prisma.service';

const PURGE_INTERVAL_MS = 5 * 60 * 1000;
const WARN_INTERVAL_MS = 60 * 1000;

interface MemoryCounter {
  hits: number;
  expiresAt: number;
}

/**
 * Contador de rate limiting compartido en PostgreSQL. Reemplaza al almacén en
 * memoria de `@nestjs/throttler`, que es por proceso: Passenger ejecuta varias
 * instancias y cada una llevaba su propia cuenta, de modo que el límite real
 * era `limit × instancias`.
 *
 * El `INSERT ... ON CONFLICT DO UPDATE` es atómico: PostgreSQL serializa los
 * incrementos de una misma clave con un bloqueo de fila, así que ninguna
 * petición concurrente se pierde, sea cual sea el proceso que la atienda.
 * Compatible con PostgreSQL 9.5+. La ventana es fija desde el primer acceso.
 *
 * Privacidad: la clave se guarda como HMAC (nunca la IP) y cada fila se purga
 * poco después de vencer. Si la base no responde se usa un contador en memoria
 * por proceso: el límite sigue aplicando, aunque por instancia.
 */
export class PostgresThrottlerStorage implements ThrottlerStorage {
  private readonly logger = new Logger('RateLimit');
  private readonly memory = new Map<string, MemoryCounter>();
  private lastWarningAt = 0;
  private degraded = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly secret: string,
  ) {
    setInterval(() => void this.purge(), PURGE_INTERVAL_MS).unref();
  }

  /** Almacén en uso, para el diagnóstico del panel. */
  get mode(): 'postgres' | 'memoria' {
    return this.degraded ? 'memoria' : 'postgres';
  }

  async increment(key: string, ttl: number): Promise<{ totalHits: number; timeToExpire: number }> {
    const counterKey = createHmac('sha256', this.secret).update(key).digest('hex');
    try {
      const rows = await this.prisma.$queryRaw<{ hits: number; seconds_left: number }[]>`
        INSERT INTO foundation.rate_limit_counters AS c (counter_key, hits, expires_at)
        VALUES (${counterKey}, 1, now() + ${`${ttl} milliseconds`}::text::interval)
        ON CONFLICT (counter_key) DO UPDATE SET
          hits = CASE WHEN c.expires_at <= now() THEN 1 ELSE c.hits + 1 END,
          expires_at = CASE WHEN c.expires_at <= now() THEN EXCLUDED.expires_at ELSE c.expires_at END
        RETURNING c.hits AS hits, ceil(extract(epoch FROM c.expires_at - now()))::int AS seconds_left`;
      this.degraded = false;
      return { totalHits: rows[0].hits, timeToExpire: Math.max(rows[0].seconds_left, 0) };
    } catch (error) {
      this.degraded = true;
      this.warn(error);
      return this.incrementInMemory(counterKey, ttl);
    }
  }

  private incrementInMemory(key: string, ttl: number): { totalHits: number; timeToExpire: number } {
    const now = Date.now();
    let counter = this.memory.get(key);
    if (!counter || counter.expiresAt <= now) {
      counter = { hits: 0, expiresAt: now + ttl };
      this.memory.set(key, counter);
    }
    counter.hits += 1;
    return { totalHits: counter.hits, timeToExpire: Math.ceil((counter.expiresAt - now) / 1000) };
  }

  private warn(error: unknown): void {
    const now = Date.now();
    if (now - this.lastWarningAt < WARN_INTERVAL_MS) return;
    this.lastWarningAt = now;
    this.logger.warn(`Contador compartido no disponible, se usa memoria por proceso: ${(error as Error).message}`);
  }

  private async purge(): Promise<void> {
    const now = Date.now();
    for (const [key, counter] of this.memory) {
      if (counter.expiresAt <= now) this.memory.delete(key);
    }
    await this.prisma.$executeRaw`DELETE FROM foundation.rate_limit_counters WHERE expires_at < now()`.catch(() => undefined);
  }
}
