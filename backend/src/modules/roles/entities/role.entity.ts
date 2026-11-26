export class RoleEntity {
  id!: string;
  // string (no el literal RoleName): roles.create permite dar de alta roles
  // nuevos más allá de los 7 iniciales de la Fase 4.
  name!: string;
  description!: string;
  permissionKeys!: string[];
  isSystem!: boolean; // roles seed (Fase 4) no se pueden eliminar
  createdAt!: Date;
  updatedAt!: Date;
}
