import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PqrEntity } from '../entities/pqr.entity';
import { PqrRepository } from './pqr.repository.interface';

/** Semillas de demostración — en producción, este módulo recibiría radicados desde el formulario público de PQR. */
const SEED: Array<Pick<PqrEntity, 'type' | 'fullName' | 'email' | 'subject' | 'description' | 'status'>> = [
  {
    type: 'PETICION',
    fullName: 'Jorge Iván Ramírez',
    email: 'jorge.ramirez@correo.com',
    subject: 'Solicitud de certificación de servicio',
    description: 'Necesito una certificación de los servicios contratados en 2025.',
    status: 'OPEN',
  },
  {
    type: 'QUEJA',
    fullName: 'Diana Marcela Ortiz',
    email: 'diana.ortiz@correo.com',
    subject: 'Demora en respuesta comercial',
    description: 'Llevo una semana esperando respuesta del equipo comercial.',
    status: 'IN_PROGRESS',
  },
];

/** Implementación TEMPORAL en memoria de `PqrRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryPqrRepository implements PqrRepository {
  private readonly items = new Map<string, PqrEntity>();

  constructor() {
    const now = new Date();
    SEED.forEach((seed, index) => {
      const id = randomUUID();
      this.items.set(id, {
        id,
        radicado: `PQR-${now.getFullYear()}-${String(index + 1).padStart(4, '0')}`,
        ...seed,
        phone: null,
        company: null,
        documentType: null,
        documentNumber: null,
        attachmentUrl: null,
        response: null,
        respondedAt: null,
        createdAt: now,
        updatedAt: now,
      });
    });
  }

  async findAll(): Promise<PqrEntity[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<PqrEntity | null> {
    return this.items.get(id) ?? null;
  }

  async findByRadicado(radicado: string): Promise<PqrEntity | null> {
    return [...this.items.values()].find((p) => p.radicado === radicado) ?? null;
  }

  async create(data: Omit<PqrEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PqrEntity> {
    const now = new Date();
    const entity: PqrEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<PqrEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<PqrEntity | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.items.set(id, updated);
    return updated;
  }

  async countOpen(): Promise<number> {
    return [...this.items.values()].filter((p) => p.status !== 'CLOSED').length;
  }

  /** No-op: esta implementación quedó reemplazada por `PrismaPqrRepository` (Etapa 14) — se conserva solo como referencia histórica. */
  async linkAttachment(): Promise<void> {}
}
