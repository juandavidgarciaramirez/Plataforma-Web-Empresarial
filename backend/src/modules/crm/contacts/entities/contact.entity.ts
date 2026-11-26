export class ContactEntity {
  id!: string;
  name!: string;
  email!: string | null;
  phone!: string | null;
  position!: string | null;
  companyId!: string | null;
  ownerUserId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
