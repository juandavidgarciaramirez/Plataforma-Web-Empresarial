export interface HeroSlideItem {
  label: string;
  /** Nombre del icono de lucide-react. */
  icon: string;
}

export class HeroSlideEntity {
  id!: string;
  slug!: string;
  /** Línea de servicio asociada (catalog.services.code), si aplica. */
  serviceCode!: string | null;
  nameWhite!: string;
  nameBlue!: string;
  title!: string;
  description!: string | null;
  imageUrl!: string | null;
  imagePosition!: string | null;
  href!: string;
  items!: HeroSlideItem[];
  order!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
