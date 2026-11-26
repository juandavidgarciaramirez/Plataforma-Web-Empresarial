import { randomBytes } from 'crypto';
import { Prisma } from '../../../../prisma/generated';
import { splitFullName } from '../../../common/utils/name.util';
import { SafeLogError } from '../../../common/utils/safe-error.util';
import crmCatalog from './crm-catalog.json';

/**
 * Catálogo requerido por el CRM: fuente única compartida con
 * `scripts/verify-deploy.js`. La migración 015 debe coincidir con este archivo
 * (lo comprueba `test/crm-catalog-consistency.test.js`).
 */
export const CRM_CATALOG = crmCatalog;

const NO_COMPANY_PLACEHOLDER_NAME = CRM_CATALOG.noCompanyPlaceholder.legalName;
const DEFAULT_COUNTRY_ISO2 = CRM_CATALOG.defaultCountryIso2;
const CATALOG_REMEDY = `ejecutar ${CRM_CATALOG.migration.file} y comprobar con "node scripts/verify-deploy.js crm"`;

/** Cualquier cliente de Prisma: el servicio o el `tx` de una transacción interactiva. */
export type CrmDbClient = Prisma.TransactionClient;

/** Falta una dependencia de instalación (catálogo o administrador), no un error del dato recibido. */
export class CrmSetupError extends SafeLogError {
  constructor(problem: string, remedy: string) {
    super(`${problem}: ${remedy}.`);
  }
}

export function missingCatalogError(problem: string): CrmSetupError {
  return new CrmSetupError(problem, CATALOG_REMEDY);
}

export function missingPlatformCatalogError(problem: string): CrmSetupError {
  return new CrmSetupError(problem, `ejecutar ${CRM_CATALOG.platformCatalog.migration.file}`);
}

/**
 * Resuelve el actor (email) de una operación CRM a un id real de
 * `security.users`. Los flujos automáticos (Yuri, formulario público de
 * Contacto) pasan un email que no corresponde a ningún usuario real (solo es
 * una etiqueta legible en la bitácora de auditoría). En ese caso, y cuando no
 * se especifica `ownerUserId`, la fila se asigna al administrador real
 * configurado en `SEED_ADMIN_EMAIL`, nunca a un usuario inventado.
 */
export async function resolveActorUserId(prisma: CrmDbClient, actorEmail?: string | null): Promise<bigint> {
  if (actorEmail) {
    const user = await prisma.users.findFirst({
      where: { email: { equals: actorEmail, mode: 'insensitive' }, deleted_at: null },
      select: { id: true },
    });
    if (user) return user.id;
  }

  const fallbackEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  if (!fallbackEmail) {
    throw new CrmSetupError(
      'No se pudo resolver un usuario real para la operación de CRM: SEED_ADMIN_EMAIL no está definido',
      'definirlo en el .env del backend',
    );
  }

  const fallback = await prisma.users.findFirst({
    where: { email: { equals: fallbackEmail, mode: 'insensitive' }, deleted_at: null },
    select: { id: true },
  });
  if (!fallback) {
    throw new CrmSetupError(
      'No se pudo resolver un usuario real para la operación de CRM: el usuario de SEED_ADMIN_EMAIL no existe o está eliminado',
      'ejecutar "npm run seed:security" o corregir la variable',
    );
  }

  return fallback.id;
}

/** Id de la empresa técnica usada cuando un contacto no pertenece a ninguna empresa. */
export async function getNoCompanyPlaceholderId(prisma: CrmDbClient): Promise<bigint> {
  const placeholder = await prisma.companies.findFirst({
    where: { legal_name: { equals: NO_COMPANY_PLACEHOLDER_NAME, mode: 'insensitive' } },
    orderBy: { id: 'asc' },
    select: { id: true },
  });
  if (!placeholder) {
    throw missingCatalogError(`No existe la empresa placeholder "${NO_COMPANY_PLACEHOLDER_NAME}" en core.companies`);
  }
  return placeholder.id;
}

/** Busca una empresa real por `legal_name` (case-insensitive); si no existe, la crea en el país por defecto. */
export async function findOrCreateCompanyByName(prisma: CrmDbClient, name: string): Promise<bigint> {
  const trimmed = name.trim();
  const existing = await prisma.companies.findFirst({
    where: { legal_name: { equals: trimmed, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return existing.id;

  const country = await prisma.countries.findFirst({ where: { iso2: DEFAULT_COUNTRY_ISO2 }, select: { id: true } });
  if (!country) {
    throw missingCatalogError(`No existe el país por defecto (core.countries, iso2=${DEFAULT_COUNTRY_ISO2})`);
  }

  const created = await prisma.companies.create({
    data: { legal_name: trimmed, commercial_name: trimmed, country_id: country.id },
    select: { id: true },
  });
  return created.id;
}

/**
 * Busca un contacto real por email (case-insensitive); si no existe, lo
 * crea. `core.contacts.company_id` es NOT NULL: si no se resuelve una empresa
 * real, se usa la empresa técnica "Sin Empresa".
 */
export async function findOrCreateContactByEmail(
  prisma: CrmDbClient,
  data: { name: string; email?: string | null; phone?: string | null; companyId?: bigint | null },
): Promise<bigint> {
  if (data.email) {
    const existing = await prisma.contacts.findFirst({
      where: { email: { equals: data.email, mode: 'insensitive' } },
      orderBy: { id: 'asc' },
      select: { id: true },
    });
    if (existing) return existing.id;
  }

  const { firstName, lastName } = splitFullName(data.name);
  const companyId = data.companyId ?? (await getNoCompanyPlaceholderId(prisma));

  const created = await prisma.contacts.create({
    data: {
      company_id: companyId,
      first_name: firstName,
      last_name: lastName,
      full_name: data.name,
      email: data.email,
      phone: data.phone,
    },
    select: { id: true },
  });
  return created.id;
}

/** `LEAD-YYYYMMDD-XXXX` con sufijo aleatorio: `crm.leads.code` es único y no autogenerado por la base. */
export function generateLeadCode(): string {
  const now = new Date();
  const day = now.toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = randomBytes(2).toString('hex').toUpperCase();
  return `LEAD-${day}-${suffix}`;
}
