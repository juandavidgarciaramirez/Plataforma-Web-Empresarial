import { UserEntity } from '../entities/user.entity';

/**
 * Contrato de persistencia para usuarios. Implementación temporal en
 * memoria; se reemplaza por PostgreSQL sin tocar UsersService/AuthService.
 */
export interface UserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity>;
  update(id: string, data: Partial<Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
