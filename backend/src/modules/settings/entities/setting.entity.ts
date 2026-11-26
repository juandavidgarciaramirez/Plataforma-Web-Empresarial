export class SettingEntity {
  id!: string;
  key!: string;
  value!: string | null;
  description!: string | null;
  dataType!: string | null;
  isPublic!: boolean;
  updatedAt!: Date;
}
