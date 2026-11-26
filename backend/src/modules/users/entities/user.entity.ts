export type UserStatus = 'ACTIVE' | 'INACTIVE';

export class UserEntity {
  id!: string;
  name!: string;
  email!: string;
  phone!: string | null;
  passwordHash!: string;
  roleId!: string;
  status!: UserStatus;
  /** Marca de tiempo del último login exitoso (sección 15 del brief). */
  lastLogin!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}

/** Forma segura del usuario para exponer por API (nunca incluye passwordHash). */
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roleId: string;
  roleName: string;
  status: UserStatus;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
