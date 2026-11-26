export class PermissionEntity {
  id!: string;
  // string (no el literal PermissionKey): permissions.create permite extender
  // el catálogo con claves nuevas más allá del seed inicial de la Fase 5.
  key!: string;
  module!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
