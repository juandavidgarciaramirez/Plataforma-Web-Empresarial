export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  icon?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceFilters {
  search?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}