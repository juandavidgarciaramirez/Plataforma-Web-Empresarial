/**
 * Seed de seguridad (idempotente): permisos, roles y usuario administrador.
 *
 *   npm run build && npm run seed:security
 *
 * Lo ejecuta una persona, no el arranque de la aplicación. No inserta datos
 * comerciales: los catálogos del CRM los define la migración 015 y los datos de
 * demostración no se ejecutan (ver database/docs/CRM_PRODUCTION_BOOTSTRAP.md).
 * Nunca modifica un usuario existente ni imprime contraseñas o correos.
 */
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../../prisma/generated';
import { splitFullName } from '../common/utils/name.util';
import { safeErrorSummary } from '../common/utils/safe-error.util';
import { CrmSetupError } from '../modules/crm/common/crm-db.util';
import { PERMISSION_KEYS, PERMISSION_MODULES } from '../modules/permissions/permissions.constants';

try {
  // Las variables ya definidas en el entorno tienen prioridad sobre el archivo.
  process.loadEnvFile('.env');
} catch {
  // Sin .env: se usan solo las variables del entorno.
}

const prisma = new PrismaClient();

const ADMIN_ROLE_NAME = 'Administrador';
/** Mismo costo que UsersService al crear usuarios. */
const PASSWORD_SALT_ROUNDS = 10;

const ROLES = [
  {
    name: 'Administrador',
    description: 'Acceso total al sistema.',
    permissions: [...PERMISSION_KEYS],
  },
  {
    name: 'Editor',
    description: 'Gestión de contenido: servicios, noticias, blog y equipo.',
    permissions: PERMISSION_KEYS.filter((p) =>
      [
        'cms.services.',
        'cms.news.',
        'cms.blog.',
        'cms.team.',
      ].some((prefix) => p.startsWith(prefix)),
    ),
  },
  {
    name: 'Comercial',
    description: 'Gestión comercial y CRM.',
    permissions: PERMISSION_KEYS.filter((p) =>
      [
        'crm.leads.',
        'crm.companies.',
        'crm.contacts.',
        'crm.opportunities.',
        'crm.pipeline.',
        'crm.tasks.',
        'crm.activities.',
        'analytics.',
      ].some((prefix) => p.startsWith(prefix)),
    ),
  },
  {
    name: 'Cliente',
    description: 'Acceso de consulta para clientes.',
    permissions: PERMISSION_KEYS.filter((p) => p.endsWith('.read')),
  },
  {
    name: 'Visitante',
    description: 'Acceso de consulta limitado.',
    permissions: [],
  },
  {
    name: 'Recursos Humanos',
    description: 'Gestión de talento humano.',
    permissions: [
      'jobs.vacancies.read',
      'jobs.vacancies.create',
      'jobs.vacancies.update',
      'jobs.vacancies.delete',
      'security.users.read',
    ],
  },
  {
    name: 'Soporte',
    description: 'Atención de PQRS.',
    permissions: [
      'pqrs.tickets.read',
      'pqrs.tickets.update',
    ],
  },
] as const;

async function main() {
  console.log('Iniciando seed de producción...');

  // 1. Permisos
  for (const key of PERMISSION_KEYS) {
    const [module, resource, action] = key.split('.');

    await prisma.permissions.upsert({
      where: { permission_key: key },
      update: {
        module: PERMISSION_MODULES[key],
        resource,
        action,
      },
      create: {
        module: PERMISSION_MODULES[key],
        resource,
        action,
        permission_key: key,
        description: `${module}.${resource}.${action}`,
      },
    });
  }

  console.log(`Permisos procesados: ${PERMISSION_KEYS.length}`);

  // 2. Roles + permisos
  for (const roleData of ROLES) {
    const role = await prisma.roles.upsert({
      where: { name: roleData.name },
      update: {
        description: roleData.description,
        is_system: true,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        name: roleData.name,
        description: roleData.description,
        is_system: true,
        is_active: true,
      },
    });

    const permissions = await prisma.permissions.findMany({
      where: {
        permission_key: {
          in: [...roleData.permissions],
        },
      },
      select: { id: true },
    });

    // En una transacción: un fallo a mitad no puede dejar el rol sin permisos.
    await prisma.$transaction(async (tx) => {
      await tx.role_permissions.deleteMany({
        where: { role_id: role.id },
      });

      if (permissions.length > 0) {
        await tx.role_permissions.createMany({
          data: permissions.map((permission) => ({
            role_id: role.id,
            permission_id: permission.id,
          })),
        });
      }
    });

    console.log(
      `Rol "${role.name}": ${permissions.length} permisos`,
    );
  }

  console.log('Seed de permisos y roles completado.');

  // 3. Usuario administrador
  await ensureAdminUser();
}

/** Crea el administrador de SEED_ADMIN_EMAIL si no existe. Un usuario existente no se modifica. */
async function ensureAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  if (!email) {
    throw new CrmSetupError('SEED_ADMIN_EMAIL no está definido', 'definirlo en backend/.env para garantizar el administrador');
  }

  const existing = await prisma.users.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) {
    console.log('Administrador: ya existe, no se modifica.');
    return;
  }

  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) {
    throw new CrmSetupError('SEED_ADMIN_PASSWORD no está definido', 'definirlo en backend/.env para crear el administrador');
  }

  const role = await prisma.roles.findUniqueOrThrow({
    where: { name: ADMIN_ROLE_NAME },
    select: { id: true },
  });
  const { firstName, lastName } = splitFullName(process.env.SEED_ADMIN_NAME?.trim() || 'Administrador del sistema');

  await prisma.users.create({
    data: {
      role_id: role.id,
      first_name: firstName,
      last_name: lastName,
      email,
      password_hash: await bcrypt.hash(password, PASSWORD_SALT_ROUNDS),
      status: 'ACTIVE',
      email_verified: true,
    },
  });
  console.log('Administrador: creado.');
}

main()
  .catch((error) => {
    console.error('ERROR:', safeErrorSummary(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
