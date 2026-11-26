import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ServiceEntity } from '../entities/service.entity';
import { ServiceRepository } from './service.repository.interface';

/** Semillas alineadas con las líneas de servicio ya publicadas en el sitio (`/servicios/*`). */
const SEED: Array<Pick<ServiceEntity, 'slug' | 'name' | 'shortDescription' | 'order'>> = [
  { slug: 'capital-business-services', name: 'Capital Business Services', shortDescription: 'Servicios administrativos y de negocio.', order: 1 },
  { slug: 'capital-hse', name: 'Capital HSE', shortDescription: 'Seguridad, salud y medio ambiente.', order: 2 },
  { slug: 'capital-learning', name: 'Capital Learning', shortDescription: 'Formación y desarrollo de talento.', order: 3 },
  { slug: 'capital-mobility', name: 'Capital Mobility', shortDescription: 'Soluciones para el sector transporte.', order: 4 },
  { slug: 'capital-staffing', name: 'Capital Staffing', shortDescription: 'Dotación y gestión de personal.', order: 5 },
];

/** Implementación TEMPORAL en memoria de `ServiceRepository`. NO toca PostgreSQL. */
@Injectable()
export class InMemoryServiceRepository implements ServiceRepository {
  private readonly items = new Map<string, ServiceEntity>();

  constructor() {
    const now = new Date();
    for (const seed of SEED) {
      const id = randomUUID();
      this.items.set(id, {
        id,
        ...seed,
        description: seed.shortDescription,
        icon: null,
        status: 'PUBLISHED',
        imageUrl: null,
        imageAlt: null,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  async findAll(): Promise<ServiceEntity[]> {
    return [...this.items.values()].sort((a, b) => a.order - b.order);
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    return this.items.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<ServiceEntity | null> {
    return [...this.items.values()].find((s) => s.slug === slug) ?? null;
  }

  async create(data: Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceEntity> {
    const now = new Date();
    const entity: ServiceEntity = { id: randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    data: Partial<Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ServiceEntity | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}
