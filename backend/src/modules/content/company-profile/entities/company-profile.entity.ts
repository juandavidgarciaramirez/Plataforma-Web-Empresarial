/**
 * Contenido institucional singular de Home y Nosotros (secciones 14/16 del
 * encargo) — Etapa 7. Fila única en `content.company_profile` (id = 1).
 */
export class CompanyProfileEntity {
  // Home: preview "Conócenos"
  homeAboutEyebrow!: string | null;
  homeAboutTitle!: string | null;
  homeAboutText!: string | null;
  homeAboutImageUrl!: string | null;
  /** CONFIGURACIÓN PENDIENTE hasta que el cliente aporte cifras reales. */
  homeAboutStat1Value!: string | null;
  homeAboutStat1Label!: string | null;
  homeAboutStat2Value!: string | null;
  homeAboutStat2Label!: string | null;

  // Nosotros: hero
  aboutHeroTitle!: string | null;
  aboutHeroSubtitle!: string | null;
  aboutHeroImageUrl!: string | null;

  // Nosotros: Quiénes somos
  aboutWhoTitle!: string | null;
  aboutWhoText!: string | null;
  aboutWhoImageUrl!: string | null;

  // Nosotros: Misión / Visión
  aboutMissionText!: string | null;
  aboutMissionImageUrl!: string | null;
  aboutVisionYear!: string | null;
  aboutVisionText!: string | null;
  aboutVisionImageUrl!: string | null;
  /** true = texto placeholder pendiente del documento institucional oficial del cliente. */
  missionVisionIsPlaceholder!: boolean;

  // Nosotros: Ecosistema Capital
  aboutEcosystemTitle!: string | null;
  aboutEcosystemText!: string | null;

  // Nosotros: encabezado de la sección equipo (organigrama)
  aboutTeamTitle!: string | null;
  aboutTeamSubtitle!: string | null;

  // Nosotros: CTA final
  aboutCtaTitle!: string | null;
  aboutCtaMessage!: string | null;
  aboutCtaImageUrl!: string | null;

  updatedAt!: Date;
}
