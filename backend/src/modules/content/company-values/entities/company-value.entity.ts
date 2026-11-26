export class CompanyValueEntity {
  id!: string;
  key!: string;
  title!: string;
  description!: string | null;
  /** Nombre del icono de lucide-react (ShieldCheck, Lock, Award, Lightbulb, Handshake, ...). */
  iconKey!: string | null;
  imageUrl!: string | null;
  order!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
