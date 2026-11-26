import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { promises as fs } from 'fs';
import * as path from 'path';

interface MigrationFile {
  name: string;
  filePath: string;
}

@Injectable()
export class MigrationService implements OnApplicationBootstrap {
  private readonly logger = new Logger('DatabaseMigration');
  private readonly pool: Pool;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL no está configurada. No se pueden ejecutar las migraciones.',
      );
    }

    this.pool = new Pool({
      connectionString: databaseUrl,
      max: 1,
    });
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.runMigrations();
  }

  private async runMigrations(): Promise<void> {
    const client = await this.pool.connect();

    try {
      this.logger.log('Iniciando sistema de migraciones...');

      /*
       * Advisory lock de PostgreSQL.
       *
       * Evita que las dos instancias de Passenger ejecuten
       * simultáneamente la misma migración.
       */
      await client.query(
        'SELECT pg_advisory_lock(7392512026)',
      );

      try {
        await this.createMigrationsTable(client);

        const migrations = await this.getMigrationFiles();

        const executed = await this.getExecutedMigrations(client);

        for (const migration of migrations) {
          if (executed.has(migration.name)) {
            this.logger.log(
              `✓ ${migration.name} ya fue ejecutada.`,
            );
            continue;
          }

          await this.executeMigration(client, migration);
        }

        this.logger.log('Sistema de migraciones finalizado correctamente.');
      } finally {
        await client.query(
          'SELECT pg_advisory_unlock(7392512026)',
        );
      }
    } finally {
      client.release();
      await this.pool.end();
    }
  }

  private async createMigrationsTable(
    client: import('pg').PoolClient,
  ): Promise<void> {
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.schema_migrations (
        id BIGSERIAL PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  private async getMigrationFiles(): Promise<MigrationFile[]> {
    /*
     * En desarrollo:
     *   backend/src/database/migrations
     *
     * En producción:
     *   backend/dist/database/migrations
     *
     * El deploy copiará los SQL al build.
     */
    const migrationsDir = this.resolveMigrationsDirectory();

    const files = await fs.readdir(migrationsDir);

    return files
      .filter(
        (file) =>
          /^\d{3}_.*\.sql$/i.test(file) &&
          !/_verify\.sql$/i.test(file),
      )
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        name,
        filePath: path.join(migrationsDir, name),
      }));
  }

  private resolveMigrationsDirectory(): string {
   const productionPath = __dirname;

    const developmentPath = path.resolve(
      process.cwd(),
      '../database/migrations',
    );

    /*
     * Nest compila src/database/migrations → dist/database/migrations.
     */
    if (process.env.NODE_ENV === 'production') {
      return productionPath;
    }

    return developmentPath;
  }

  private async getExecutedMigrations(
    client: import('pg').PoolClient,
  ): Promise<Set<string>> {
    const result = await client.query<{
      migration_name: string;
    }>(`
      SELECT migration_name
      FROM public.schema_migrations
      ORDER BY migration_name;
    `);

    return new Set(
      result.rows.map((row) => row.migration_name),
    );
  }

  private async executeMigration(
    client: import('pg').PoolClient,
    migration: MigrationFile,
  ): Promise<void> {
    this.logger.log(`→ Ejecutando ${migration.name}...`);

    const sql = await fs.readFile(
      migration.filePath,
      'utf8',
    );

    /*
     * Las migraciones existentes ya contienen BEGIN/COMMIT.
     * Por eso no agregamos otra transacción aquí.
     */
    await client.query(sql);

    /*
     * Solo registramos la migración después de que
     * PostgreSQL haya ejecutado correctamente todo el archivo.
     */
    await client.query(
      `
        INSERT INTO public.schema_migrations (migration_name)
        VALUES ($1)
        ON CONFLICT (migration_name) DO NOTHING;
      `,
      [migration.name],
    );

    this.logger.log(`✓ ${migration.name} ejecutada correctamente.`);
  }
}