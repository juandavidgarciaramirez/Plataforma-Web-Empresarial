import { PermissionEntity } from '../entities/permission.entity';

/**
 * Contrato de persistencia para permisos. La implementación en memoria es
 * temporal; cuando el esquema PostgreSQL esté listo, solo se reemplaza el
 * provider `PERMISSION_REPOSITORY` por una implementación real (Prisma/
 * TypeORM) que cumpla esta misma interfaz — el resto de capas no cambia.
 */
export interface PermissionRepository {
  findAll(): Promise<PermissionEntity[]>;
  findById(id: string): Promise<PermissionEntity | null>;
  findByKey(key: string): Promise<PermissionEntity | null>;
  findByKeys(keys: string[]): Promise<PermissionEntity[]>;
  create(data: Pick<PermissionEntity, 'key' | 'module' | 'description'>): Promise<PermissionEntity>;
  update(id: string, data: Partial<Pick<PermissionEntity, 'module' | 'description'>>): Promise<PermissionEntity | null>;
  delete(id: string): Promise<boolean>;
}

export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY';
