import { PqrEntity } from '../entities/pqr.entity';

export interface PqrRepository {
  findAll(): Promise<PqrEntity[]>;
  findById(id: string): Promise<PqrEntity | null>;
  /** Búsqueda pública por radicado (sección 21 del encargo: el ciudadano consulta su solicitud). */
  findByRadicado(radicado: string): Promise<PqrEntity | null>;
  create(data: Omit<PqrEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PqrEntity>;
  update(id: string, data: Partial<Omit<PqrEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PqrEntity | null>;
  countOpen(): Promise<number>;
  /** Enlaza un archivo ya registrado en `foundation.files` con una PQR (Etapa 14). */
  linkAttachment(requestId: string, fileId: string): Promise<void>;
}

export const PQR_REPOSITORY = 'PQR_REPOSITORY';
