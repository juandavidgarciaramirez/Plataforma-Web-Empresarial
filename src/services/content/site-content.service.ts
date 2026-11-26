import { api } from "@/lib/api/axios";

/** Contenido institucional singular de Home/Nosotros — `/api/v1/company-profile`. */
export interface ApiCompanyProfile {
  homeAboutEyebrow: string | null;
  homeAboutTitle: string | null;
  homeAboutText: string | null;
  homeAboutImageUrl: string | null;
  homeAboutStat1Value: string | null;
  homeAboutStat1Label: string | null;
  homeAboutStat2Value: string | null;
  homeAboutStat2Label: string | null;
  aboutHeroTitle: string | null;
  aboutHeroSubtitle: string | null;
  aboutHeroImageUrl: string | null;
  aboutWhoTitle: string | null;
  aboutWhoText: string | null;
  aboutWhoImageUrl: string | null;
  aboutMissionText: string | null;
  aboutMissionImageUrl: string | null;
  aboutVisionYear: string | null;
  aboutVisionText: string | null;
  aboutVisionImageUrl: string | null;
  missionVisionIsPlaceholder: boolean;
  aboutEcosystemTitle: string | null;
  aboutEcosystemText: string | null;
  aboutTeamTitle: string | null;
  aboutTeamSubtitle: string | null;
  aboutCtaTitle: string | null;
  aboutCtaMessage: string | null;
  aboutCtaImageUrl: string | null;
  updatedAt: string;
}

export const companyProfileService = {
  get: () => api.get<{ data: ApiCompanyProfile }>("/company-profile").then((res) => res.data.data),
  update: (data: Partial<ApiCompanyProfile>) =>
    api.patch<{ data: ApiCompanyProfile }>("/company-profile", data).then((res) => res.data.data),
};

/** Slides del carrusel de Home — `/api/v1/hero-slides`. */
export interface ApiHeroSlideItem {
  label: string
  icon: string
}

export interface ApiHeroSlide {
  id: string;
  slug: string;
  serviceCode: string | null;
  nameWhite: string;
  nameBlue: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imagePosition: string | null;
  href: string;
  items: ApiHeroSlideItem[];
  order: number;
  isActive: boolean;
}

export interface HeroSlideInput {
  slug: string;
  serviceCode?: string;
  nameWhite: string;
  nameBlue: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imagePosition?: string;
  href: string;
  items?: ApiHeroSlideItem[];
  order?: number;
  isActive?: boolean;
}

export const heroSlidesService = {
  getAll: () => api.get<{ data: ApiHeroSlide[] }>("/hero-slides").then((res) => res.data.data),
  create: (data: HeroSlideInput) => api.post<{ data: ApiHeroSlide }>("/hero-slides", data).then((res) => res.data.data),
  update: (id: string, data: Partial<HeroSlideInput>) =>
    api.patch<{ data: ApiHeroSlide }>(`/hero-slides/${id}`, data).then((res) => res.data.data),
  remove: (id: string) => api.delete(`/hero-slides/${id}`),
};

/** Valores corporativos — `/api/v1/company-values`. */
export interface ApiCompanyValue {
  id: string;
  key: string;
  title: string;
  description: string | null;
  iconKey: string | null;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}

export interface CompanyValueInput {
  key: string;
  title: string;
  description?: string;
  iconKey?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}

export const companyValuesService = {
  getAll: () => api.get<{ data: ApiCompanyValue[] }>("/company-values").then((res) => res.data.data),
  create: (data: CompanyValueInput) =>
    api.post<{ data: ApiCompanyValue }>("/company-values", data).then((res) => res.data.data),
  update: (id: string, data: Partial<CompanyValueInput>) =>
    api.patch<{ data: ApiCompanyValue }>(`/company-values/${id}`, data).then((res) => res.data.data),
  remove: (id: string) => api.delete(`/company-values/${id}`),
};

/** Conceptos de "Quiénes somos" — `/api/v1/who-we-are-concepts`. */
export interface ApiWhoWeAreConcept {
  id: string;
  key: string;
  label: string;
  description: string | null;
  order: number;
  isActive: boolean;
}

export interface WhoWeAreConceptInput {
  key: string;
  label: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export const whoWeAreConceptsService = {
  getAll: () => api.get<{ data: ApiWhoWeAreConcept[] }>("/who-we-are-concepts").then((res) => res.data.data),
  create: (data: WhoWeAreConceptInput) =>
    api.post<{ data: ApiWhoWeAreConcept }>("/who-we-are-concepts", data).then((res) => res.data.data),
  update: (id: string, data: Partial<WhoWeAreConceptInput>) =>
    api.patch<{ data: ApiWhoWeAreConcept }>(`/who-we-are-concepts/${id}`, data).then((res) => res.data.data),
  remove: (id: string) => api.delete(`/who-we-are-concepts/${id}`),
};
