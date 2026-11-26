import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ApplicationEntity } from '../entities/application.entity';
import { ApplicationRepository } from './application.repository.interface';

/** Semillas de demostración — en producción, llegarían desde el formulario público de postulación. */
const SEED: Array<Pick<ApplicationEntity, 'vacancyTitle' | 'fullName' | 'email' | 'status'>> = [
  { vacancyTitle: 'Analista HSE', fullName: 'Camila Torres', email: 'camila.torres@correo.com', status: 'RECEIVED' },
  { vacancyTitle: 'Conductor profesional', fullName: 'Andrés Felipe Gómez', email: 'andres.gomez@correo.com', status: 'REVIEWED' },
];

/** Implementación TEMPORAL en memoria de `ApplicationRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryApplicationRepository implements ApplicationRepository {
  private readonly items = new Map<string, ApplicationEntity>();

  constructor() {
    const now = new Date();
    for (const seed of SEED) {
      const id = randomUUID();
      this.items.set(id, {
        id,
        vacancyId: null,
        ...seed,
        phone: null,
        cvUrl: null,
        message: null,
        documentType: null,
        documentNumber: null,
        city: null,
        experienceRange: null,
        educationLevel: null,
        relocation: null,
        linkedin: null,
        salaryExpectation: null,
        referralSource: null,
        sectors: [],
        cvFileName: null,
        cvSizeBytes: null,
        cvMimeType: null,
        consent: null,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  async findAll(): Promise<ApplicationEntity[]> {
    return [...this.items.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<ApplicationEntity | null> {
    return this.items.get(id) ?? null;
  }

  async create(data: Omit<ApplicationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApplicationEntity> {
    const now = new Date();
    const entity: ApplicationEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<ApplicationEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ApplicationEntity | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.items.set(id, updated);
    return updated;
  }

  async countRecent(days: number): Promise<number> {
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    return [...this.items.values()].filter((a) => a.createdAt.getTime() >= threshold).length;
  }
}
