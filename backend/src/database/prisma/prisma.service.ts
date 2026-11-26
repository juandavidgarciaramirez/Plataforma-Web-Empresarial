import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../prisma/generated';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('Prisma');

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Conectado a PostgreSQL.');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
