import { RoleEntity } from '../entities/role.entity';

/**
 * Contrato de persistencia para roles. Implementación temporal en memoria;
 * se reemplaza por PostgreSQL sin tocar RolesService ni el controller.
 */
export interface RoleRepository {
  findAll(): Promise<RoleEntity[]>;
  findById(id: string): Promise<RoleEntity | null>;
  findByName(name: string): Promise<RoleEntity | null>;
  create(data: Pick<RoleEntity, 'name' | 'description' | 'permissionKeys'> & { isSystem?: boolean }): Promise<RoleEntity>;
  update(id: string, data: Partial<Pick<RoleEntity, 'description' | 'permissionKeys'>>): Promise<RoleEntity | null>;
  delete(id: string): Promise<boolean>;
}

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';
