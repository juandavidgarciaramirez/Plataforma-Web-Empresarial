#!/usr/bin/env node
/**
 * Verificación del despliegue del backend (Etapa 15). NO modifica la base de
 * datos ni ejecuta migraciones: solo consulta el catálogo y crea/borra un
 * archivo temporal propio en la carpeta de imágenes.
 *
 *   node scripts/verify-deploy.js preflight   antes de compilar: variables, PostgreSQL, esquema y almacenamiento.
 *   node scripts/verify-deploy.js postflight  tras reiniciar: API viva, imágenes públicas, endpoints protegidos y catálogo CRM.
 *   node scripts/verify-deploy.js crm         solo el catálogo CRM (tras ejecutar una migración, por ejemplo).
 *
 * Termina con código 1 si algo obligatorio falla. Nunca imprime secretos.
 */
const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
// Fuente única del catálogo requerido, compartida con el código de la API.
const crmCatalog = require('../src/modules/crm/common/crm-catalog.json');

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
}
loadDotEnv(path.join(process.cwd(), '.env'));

const isProduction = process.env.NODE_ENV === 'production';
let failures = 0;
const ok = (label, detail = '') => console.log(`OK ${label}${detail ? ` — ${detail}` : ''}`);
const warn = (label, detail = '') => console.log(`AVISO ${label}${detail ? ` — ${detail}` : ''}`);
const fail = (label, detail = '') => {
  failures += 1;
  console.log(`FALLO ${label}${detail ? ` — ${detail}` : ''}`);
};

/** Objetos que el código actual necesita. Incluye la 014 y lo que agregaron 008-010 respecto al volcado inicial de producción. */
const REQUIRED_TABLES = [
  ['foundation', 'file_links'],
  ['foundation', 'rate_limit_counters'],
  ['analytics', 'visitors'],
  ['analytics', 'sessions'],
  ['analytics', 'events'],
  ['foundation', 'notifications'],
];
const REQUIRED_COLUMNS = [
  ['foundation', 'files', 'width'],
  ['foundation', 'files', 'height'],
  ['catalog', 'services', 'image_url'],
  ['catalog', 'services', 'image_alt'],
  ['careers', 'job_positions', 'image_url'],
  ['careers', 'job_positions', 'image_alt'],
  ['careers', 'job_positions', 'department'],
  ['careers', 'applications', 'cv_file_id'],
  ['content', 'team_members', 'photo_alt'],
  ['content', 'posts', 'image_alt'],
  ['content', 'posts', 'content_blocks'],
  ['pqr', 'requests', 'document_number'],
];
const REQUIRED_PERMISSIONS = ['analytics.dashboard.read', 'analytics.reports.export'];

/** Tablas de las que depende la creación de un lead. */
const CRM_TABLES = [
  ['crm', 'lead_sources'],
  ['crm', 'lead_statuses'],
  ['crm', 'pipelines'],
  ['crm', 'pipeline_stages'],
  ['crm', 'leads'],
  ['core', 'countries'],
  ['core', 'companies'],
  ['core', 'contacts'],
  ['security', 'users'],
];
/** Relaciones que debe cumplir un lead: [tabla, columna, tabla referenciada]. */
const CRM_RELATIONS = [
  ['crm.leads', 'contact_id', 'core.contacts'],
  ['crm.leads', 'company_id', 'core.companies'],
  ['crm.leads', 'assigned_to', 'security.users'],
  ['crm.leads', 'created_by', 'security.users'],
  ['crm.leads', 'source_id', 'crm.lead_sources'],
  ['crm.leads', 'status_id', 'crm.lead_statuses'],
  ['crm.leads', 'pipeline_id', 'crm.pipelines'],
  ['crm.leads', 'stage_id', 'crm.pipeline_stages'],
  ['crm.pipeline_stages', 'pipeline_id', 'crm.pipelines'],
  ['core.contacts', 'company_id', 'core.companies'],
  ['core.companies', 'country_id', 'core.countries'],
];
/** Catálogos ajenos al CRM (migración 016): no impiden crear leads, así que solo se avisa si faltan códigos que usa el código. */
const { platformCatalog } = crmCatalog;
const RUN_PLATFORM_BOOTSTRAP = `Ejecutar ${platformCatalog.migration.file}`;
const PLATFORM_CATALOGS = [
  { table: 'pqr.request_types', codes: platformCatalog.pqrTypes, impact: 'la radicación de PQR falla' },
  { table: 'pqr.request_statuses', codes: platformCatalog.pqrStatuses, impact: 'la radicación de PQR falla' },
  { table: 'pqr.request_priorities', codes: platformCatalog.pqrPriorities, impact: 'la radicación de PQR falla' },
  { table: 'chat.chat_intents', codes: crmCatalog.yuri.intentCodes, impact: 'Yuri responde, pero sus conversaciones quedan sin intención registrada' },
];

const VERIFY_AGAIN = `Después: node scripts/verify-deploy.js crm y ${crmCatalog.migration.verifyFile}`;
const RUN_BOOTSTRAP = [
  `Migración: ${crmCatalog.migration.name}`,
  `Archivo: ${crmCatalog.migration.file}`,
  VERIFY_AGAIN,
];
const MANUAL_REVIEW = [
  `Migración: ${crmCatalog.migration.name} se detiene ante esta contradicción y no la corrige: hay que decidir manualmente`,
  'Archivo: database/docs/CRM_PRODUCTION_BOOTSTRAP.md (sección "Recuperación")',
  VERIFY_AGAIN,
];
const RUN_SECURITY_SEED = [
  'Solución: definir SEED_ADMIN_EMAIL (y SEED_ADMIN_PASSWORD si hay que crearlo) en backend/.env y ejecutar: npm run build && npm run seed:security',
  'Archivo: backend/src/database/production-seed.ts',
  'Después: node scripts/verify-deploy.js crm',
];
const FIX_SCHEMA = [
  'Solución: aplicar el esquema base y las migraciones anteriores. La 015 solo inserta datos, no crea tablas ni relaciones',
  'Archivo: database/docs/CRM_PRODUCTION_BOOTSTRAP.md (sección "Orden de migraciones")',
  'Después: node scripts/verify-deploy.js crm',
];

function mediaDirectory() {
  return path.resolve(process.env.FILE_STORAGE_PATH || './uploads', 'media');
}

function mediaBaseUrl() {
  const configured = process.env.MEDIA_PUBLIC_BASE_URL?.trim().replace(/\/+$/, '');
  if (configured) return configured;
  const prefix = (process.env.API_PREFIX || 'api/v1').replace(/^\/+|\/+$/g, '');
  return isProduction ? null : `http://localhost:${process.env.PORT || 3001}/${prefix}/media/public`;
}

function checkEnvironment() {
  for (const name of ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']) {
    if (process.env[name]) ok(`Variable ${name}`, 'definida');
    else fail(`Variable ${name}`, 'falta');
  }
  const media = mediaBaseUrl();
  if (!media) fail('MEDIA_PUBLIC_BASE_URL', 'falta: la carga de imágenes respondería 503');
  else if (isProduction && !media.startsWith('https://')) fail('MEDIA_PUBLIC_BASE_URL', `debe usar https: ${media}`);
  else if (!media.endsWith('/media/public')) fail('MEDIA_PUBLIC_BASE_URL', `debe terminar en /media/public: ${media}`);
  else ok('MEDIA_PUBLIC_BASE_URL', media);

  const provider = (process.env.FILE_STORAGE_PROVIDER || 'local').toLowerCase();
  if (provider === 'local') ok('FILE_STORAGE_PROVIDER', provider);
  else fail('FILE_STORAGE_PROVIDER', `"${provider}" no está implementado`);

  const origins = process.env.ANALYTICS_ALLOWED_ORIGINS || process.env.CORS_ORIGINS || '';
  if (!origins) warn('ANALYTICS_ALLOWED_ORIGINS / CORS_ORIGINS', 'sin definir');
  else if (isProduction && /localhost|127\.0\.0\.1/.test(origins)) fail('ANALYTICS_ALLOWED_ORIGINS / CORS_ORIGINS', 'incluye localhost en producción');
  else ok('Orígenes permitidos', origins);
  if (!isProduction) warn('NODE_ENV', `${process.env.NODE_ENV || '(sin definir)'}: se esperaba production en el servidor`);
}

function safeDatabaseError(error) {
  return error.message.replace(/postgres(ql)?:\/\/[^\s]+/g, '<DATABASE_URL>');
}

async function withDatabase(work) {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no está definida');
  const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
  await client.connect();
  try {
    return await work(client);
  } finally {
    await client.end();
  }
}

/** Una dependencia del CRM falla: qué falta, qué migración o paso lo resuelve, en qué archivo y qué verificar después. */
function crmFail(label, problem, remedy = RUN_BOOTSTRAP) {
  fail(label, problem);
  for (const line of remedy) console.log(`      ${line}`);
}

async function checkCrmTables(client) {
  const { rows } = await client.query(
    `SELECT table_schema || '.' || table_name AS name FROM information_schema.tables WHERE table_schema = ANY($1)`,
    [[...new Set(CRM_TABLES.map(([schema]) => schema))]],
  );
  const existing = new Set(rows.map((row) => row.name));
  const missing = CRM_TABLES.map(([schema, table]) => `${schema}.${table}`).filter((name) => !existing.has(name));
  if (missing.length) crmFail('CRM tables', `no existen: ${missing.join(', ')}`, FIX_SCHEMA);
  else ok('CRM tables', `${CRM_TABLES.length}/${CRM_TABLES.length}`);
  return missing.length === 0;
}

async function checkLeadSources(client) {
  const { rows } = await client.query('SELECT name, is_active FROM crm.lead_sources');
  const missing = crmCatalog.leadSources.filter((name) => !rows.some((row) => row.name === name));
  if (missing.length) crmFail('Lead sources', `faltan en crm.lead_sources: ${missing.join(', ')}`);
  else ok('Lead sources', `${crmCatalog.leadSources.length}/${crmCatalog.leadSources.length}`);

  const inactive = rows.filter((row) => crmCatalog.leadSources.includes(row.name) && !row.is_active);
  if (inactive.length) warn('Lead sources', `desactivadas: ${inactive.map((row) => row.name).join(', ')}`);
  return rows.map((row) => row.name);
}

async function checkLeadStatuses(client) {
  const { rows } = await client.query('SELECT name, is_active FROM crm.lead_statuses');
  const missing = crmCatalog.leadStatuses.filter((name) => !rows.some((row) => row.name === name));
  if (missing.length) crmFail('Lead statuses', `faltan en crm.lead_statuses: ${missing.join(', ')}`);
  else ok('Lead statuses', `${crmCatalog.leadStatuses.length}/${crmCatalog.leadStatuses.length}`);

  const inactive = rows.filter((row) => crmCatalog.leadStatuses.includes(row.name) && !row.is_active);
  if (inactive.length) warn('Lead statuses', `desactivados: ${inactive.map((row) => row.name).join(', ')}`);
  const unmapped = rows.filter((row) => !crmCatalog.statusToApp[row.name]);
  if (unmapped.length) warn('Lead statuses', `sin correspondencia en la aplicación (se mostrarán como NEW): ${unmapped.map((row) => row.name).join(', ')}`);
  return rows.map((row) => row.name);
}

/** Devuelve el id del pipeline predeterminado válido, o null si falta o es contradictorio. */
async function checkDefaultPipeline(client) {
  const expected = crmCatalog.pipeline.name;
  const { rows } = await client.query('SELECT id, name, is_default, is_active FROM crm.pipelines ORDER BY id');
  const defaults = rows.filter((row) => row.is_default === true);
  const names = (list) => list.map((row) => row.name).join(', ');

  const inactive = defaults.filter((row) => row.is_active !== true);
  if (inactive.length) {
    crmFail('Default pipeline', `predeterminado desactivado: ${names(inactive)}`, MANUAL_REVIEW);
    return null;
  }
  if (defaults.length > 1) {
    crmFail('Default pipeline', `debe haber exactamente un predeterminado activo y hay ${defaults.length}: ${names(defaults)}`, MANUAL_REVIEW);
    return null;
  }
  if (defaults.length === 1 && defaults[0].name !== expected) {
    crmFail('Default pipeline', `el predeterminado es "${defaults[0].name}", se esperaba "${expected}"`, MANUAL_REVIEW);
    return null;
  }
  if (defaults.length === 0) {
    if (rows.some((row) => row.name === expected)) {
      crmFail('Default pipeline', `"${expected}" existe pero no es el predeterminado activo`, MANUAL_REVIEW);
    } else {
      crmFail('Default pipeline', `falta "${expected}" en crm.pipelines`);
    }
    return null;
  }
  ok('Default pipeline', expected);
  return defaults[0].id;
}

/** Devuelve los nombres de etapa del pipeline, o null si no se pudo comprobar. */
async function checkPipelineStages(client, pipelineId) {
  if (pipelineId === null) {
    warn('Pipeline stages', 'no se comprobaron: primero hay que resolver el pipeline predeterminado');
    return null;
  }
  const { rows } = await client.query(
    'SELECT name, stage_order, is_closed, is_success FROM crm.pipeline_stages WHERE pipeline_id = $1',
    [pipelineId],
  );
  const missing = [];
  const contradictory = [];
  const reordered = [];
  for (const stage of crmCatalog.pipeline.stages) {
    const found = rows.filter((row) => row.name === stage.name);
    if (found.length === 0) missing.push(stage.name);
    else if (found.length > 1) contradictory.push(`"${stage.name}" duplicada`);
    else {
      if (found[0].is_closed !== stage.isClosed || found[0].is_success !== stage.isSuccess) {
        contradictory.push(`"${stage.name}" con is_closed/is_success distintos de ${stage.isClosed}/${stage.isSuccess}`);
      }
      if (found[0].stage_order !== stage.order) reordered.push(`${stage.name}=${found[0].stage_order} (referencia ${stage.order})`);
    }
  }
  if (missing.length) crmFail('Pipeline stages', `faltan en crm.pipeline_stages: ${missing.join(', ')}`);
  if (contradictory.length) crmFail('Pipeline stages', contradictory.join('; '), MANUAL_REVIEW);
  if (!missing.length && !contradictory.length) {
    ok('Pipeline stages', `${crmCatalog.pipeline.stages.length}/${crmCatalog.pipeline.stages.length}`);
  }
  // Una instalación puede tener etapas adicionales: el código localiza las etapas por nombre, no por orden.
  if (reordered.length) warn('Pipeline stages', `otro stage_order (válido, no se modifica): ${reordered.join(', ')}`);
  return rows.map((row) => row.name);
}

function checkAppCorrespondence(sourceNames, statusNames, stageNames) {
  const problems = [];
  for (const [appSource, name] of Object.entries(crmCatalog.appSources)) {
    if (!sourceNames.includes(name)) problems.push(`fuente ${appSource} -> "${name}"`);
  }
  for (const [appStatus, { status, stage }] of Object.entries(crmCatalog.appStatuses)) {
    if (!statusNames.includes(status)) problems.push(`estado ${appStatus} -> "${status}"`);
    if (stageNames && !stageNames.includes(stage)) problems.push(`etapa de ${appStatus} -> "${stage}"`);
  }
  const label = 'Correspondencia aplicación-PostgreSQL';
  if (problems.length) crmFail(label, `la aplicación usa registros inexistentes: ${problems.join(', ')}`);
  else ok(label, `${Object.keys(crmCatalog.appSources).length} fuentes, ${Object.keys(crmCatalog.appStatuses).length} estados`);
}

async function checkDefaultCountry(client) {
  const iso2 = crmCatalog.defaultCountryIso2;
  const { rowCount } = await client.query('SELECT 1 FROM core.countries WHERE iso2 = $1', [iso2]);
  if (rowCount === 0) crmFail('Default country', `falta el país con iso2 = ${iso2} en core.countries`);
  else ok('Default country', iso2);
}

async function checkNoCompanyPlaceholder(client) {
  const { legalName, commercialName } = crmCatalog.noCompanyPlaceholder;
  const { rows } = await client.query(
    `SELECT c.commercial_name, c.is_active, co.iso2
       FROM core.companies c LEFT JOIN core.countries co ON co.id = c.country_id
      WHERE lower(c.legal_name) = lower($1)`,
    [legalName],
  );
  if (rows.length === 0) return crmFail('No-company placeholder', `falta "${legalName}" en core.companies`);
  if (rows.length > 1) return crmFail('No-company placeholder', `"${legalName}" está duplicada (${rows.length} filas)`, MANUAL_REVIEW);

  ok('No-company placeholder');
  const [row] = rows;
  if (!row.is_active) warn('No-company placeholder', 'está desactivada');
  if (row.commercial_name !== commercialName) warn('No-company placeholder', `nombre comercial distinto de "${commercialName}"`);
  if (row.iso2 !== crmCatalog.defaultCountryIso2) warn('No-company placeholder', `país distinto de ${crmCatalog.defaultCountryIso2}`);
}

/** Nunca imprime el correo configurado. */
async function checkCrmAdministrator(client) {
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  if (!email) return crmFail('CRM administrator', 'SEED_ADMIN_EMAIL no está definido', RUN_SECURITY_SEED);

  const { rows } = await client.query('SELECT status, deleted_at FROM security.users WHERE lower(email) = lower($1)', [email]);
  if (rows.length === 0) return crmFail('CRM administrator', 'el usuario de SEED_ADMIN_EMAIL no existe en security.users', RUN_SECURITY_SEED);
  if (!rows.some((row) => row.deleted_at === null && row.status === 'ACTIVE')) {
    return crmFail('CRM administrator', 'el usuario de SEED_ADMIN_EMAIL está eliminado o no está activo', RUN_SECURITY_SEED);
  }
  ok('CRM administrator');
}

async function checkCrmRelations(client) {
  const { rows } = await client.query(
    `SELECT src_ns.nspname || '.' || src.relname AS source, a.attname AS column_name, ref_ns.nspname || '.' || ref.relname AS target
       FROM pg_constraint c
       JOIN pg_class src ON src.oid = c.conrelid
       JOIN pg_namespace src_ns ON src_ns.oid = src.relnamespace
       JOIN pg_class ref ON ref.oid = c.confrelid
       JOIN pg_namespace ref_ns ON ref_ns.oid = ref.relnamespace
       JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
      WHERE c.contype = 'f' AND array_length(c.conkey, 1) = 1 AND src_ns.nspname IN ('crm', 'core')`,
  );
  const missing = CRM_RELATIONS.filter(
    ([source, column, target]) => !rows.some((row) => row.source === source && row.column_name === column && row.target === target),
  ).map(([source, column, target]) => `${source}.${column} -> ${target}`);
  if (missing.length) crmFail('Lead relations', `faltan claves foráneas: ${missing.join(', ')}`, FIX_SCHEMA);
  else ok('Lead relations', `${CRM_RELATIONS.length}/${CRM_RELATIONS.length}`);

  // Solo informa: los leads existentes nunca se modifican durante un despliegue.
  const mismatch = await client.query(
    `SELECT count(*)::int AS total FROM crm.leads l JOIN crm.pipeline_stages s ON s.id = l.stage_id WHERE s.pipeline_id <> l.pipeline_id`,
  );
  if (mismatch.rows[0].total > 0) warn('Lead relations', `${mismatch.rows[0].total} lead(s) con una etapa de otro pipeline`);
}

/** Dependencias que no bloquean la creación de leads. Nunca incrementan los fallos. */
async function warnOptionalCatalogs(client) {
  const present = async (qualifiedName) => (await client.query('SELECT to_regclass($1) AS name', [qualifiedName])).rows[0].name !== null;

  // foundation.files.company_id es obligatorio y el código lo resuelve por este nombre.
  const { legalName } = crmCatalog.ownCompany;
  const ownCompany = await client.query('SELECT 1 FROM core.companies WHERE lower(legal_name) = lower($1)', [legalName]);
  if (ownCompany.rowCount === 0) {
    warn(`Empresa propia "${legalName}"`, 'no existe en core.companies: fallan las postulaciones, los adjuntos de PQR y la carga de imágenes. Crearla o ajustar ownCompany en crm-catalog.json');
  }

  for (const { table, codes, impact } of PLATFORM_CATALOGS) {
    if (!(await present(table))) {
      warn(`Catálogo ${table}`, 'la tabla no existe');
      continue;
    }
    const { rows } = await client.query(`SELECT code FROM ${table} WHERE code = ANY($1)`, [codes]);
    const missing = codes.filter((code) => !rows.some((row) => row.code === code));
    if (missing.length) warn(`Catálogo ${table}`, `faltan ${missing.join(', ')}: ${impact}. ${RUN_PLATFORM_BOOTSTRAP}`);
  }

  if (await present('foundation.storage_providers')) {
    const { rows } = await client.query(
      'SELECT count(*)::int AS total, count(*) FILTER (WHERE is_active IS TRUE)::int AS active FROM foundation.storage_providers',
    );
    const label = 'Catálogo foundation.storage_providers';
    if (rows[0].total === 0) warn(label, `vacío: los archivos subidos quedan sin proveedor registrado. ${RUN_PLATFORM_BOOTSTRAP}`);
    else if (rows[0].active === 0) warn(label, 'todos los proveedores están desactivados: los archivos subidos quedan sin proveedor registrado');
  } else {
    warn('Catálogo foundation.storage_providers', 'la tabla no existe');
  }

  if (await present('catalog.services')) {
    const { rows } = await client.query('SELECT code FROM catalog.services WHERE code = ANY($1)', [crmCatalog.yuri.serviceCodes]);
    const missing = crmCatalog.yuri.serviceCodes.filter((code) => !rows.some((row) => row.code === code));
    if (missing.length) warn('Yuri: servicios', `faltan en catalog.services (migración 013): ${missing.join(', ')}`);
  }
}

/** No exige que crm.leads esté vacío: solo lee, y los leads reales siguen intactos. */
async function checkCrm(client) {
  const failuresBefore = failures;
  if (await checkCrmTables(client)) {
    const sourceNames = await checkLeadSources(client);
    const statusNames = await checkLeadStatuses(client);
    const pipelineId = await checkDefaultPipeline(client);
    const stageNames = await checkPipelineStages(client, pipelineId);
    checkAppCorrespondence(sourceNames, statusNames, stageNames);
    await checkDefaultCountry(client);
    await checkNoCompanyPlaceholder(client);
    await checkCrmAdministrator(client);
    await checkCrmRelations(client);
    await warnOptionalCatalogs(client);
  }
  const problems = failures - failuresBefore;
  if (problems === 0) ok('CRM catalog ready');
  else console.log(`FALLO CRM catalog ready — ${problems} problema(s): Yuri y los formularios no podrán registrar leads hasta resolverlos`);
}

async function runCrmChecks() {
  try {
    await withDatabase(checkCrm);
  } catch (error) {
    fail('CRM catalog ready', safeDatabaseError(error));
  }
}

async function checkDatabase() {
  await withDatabase(async (client) => {
    const version = await client.query('SHOW server_version');
    ok('PostgreSQL accesible', `versión ${version.rows[0].server_version}`);

    const tables = await client.query(
      `SELECT table_schema || '.' || table_name AS name FROM information_schema.tables WHERE table_schema = ANY($1)`,
      [[...new Set(REQUIRED_TABLES.map(([schema]) => schema))]],
    );
    const existingTables = new Set(tables.rows.map((row) => row.name));
    for (const [schema, table] of REQUIRED_TABLES) {
      if (existingTables.has(`${schema}.${table}`)) ok(`Tabla ${schema}.${table}`);
      else fail(`Tabla ${schema}.${table}`, 'no existe: aplicar la migración pendiente antes de desplegar');
    }

    const columns = await client.query(
      `SELECT table_schema || '.' || table_name || '.' || column_name AS name FROM information_schema.columns WHERE table_schema = ANY($1)`,
      [[...new Set(REQUIRED_COLUMNS.map(([schema]) => schema))]],
    );
    const existingColumns = new Set(columns.rows.map((row) => row.name));
    for (const [schema, table, column] of REQUIRED_COLUMNS) {
      if (existingColumns.has(`${schema}.${table}.${column}`)) ok(`Columna ${schema}.${table}.${column}`);
      else fail(`Columna ${schema}.${table}.${column}`, 'no existe: aplicar la migración pendiente antes de desplegar');
    }

    const permissions = await client.query('SELECT permission_key FROM security.permissions WHERE permission_key = ANY($1)', [REQUIRED_PERMISSIONS]);
    const found = new Set(permissions.rows.map((row) => row.permission_key));
    for (const key of REQUIRED_PERMISSIONS) {
      if (found.has(key)) ok(`Permiso ${key}`);
      else fail(`Permiso ${key}`, 'no existe: aplicar la migración 014');
    }
  });
}

function checkStorage() {
  const dir = mediaDirectory();
  const probe = path.join(dir, `.verify-${randomUUID()}`);
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(probe, 'ok');
    fs.unlinkSync(probe);
    ok('Carpeta de imágenes con escritura', dir);
  } catch (error) {
    fail('Carpeta de imágenes con escritura', `${dir}: ${error.message}`);
  }
}

async function preflight() {
  checkEnvironment();
  try {
    await checkDatabase();
  } catch (error) {
    fail('Conexión a PostgreSQL', safeDatabaseError(error));
  }
  await runCrmChecks();
  checkStorage();
}

/** Passenger levanta la app con la primera petición tras el reinicio: se reintenta durante un minuto. */
async function waitForApi(api) {
  const deadline = Date.now() + 60_000;
  let last = 'sin respuesta';
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${api}/health/ready`);
      if (response.status === 200) return ok('API lista', `${api}/health/ready`);
      last = `HTTP ${response.status}`;
    } catch (error) {
      last = error.cause?.code || error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  fail('API lista', `${api}/health/ready: ${last}`);
}

async function checkImagePublished(media) {
  // PNG real de 1×1: se sirve por la misma ruta pública que las imágenes del CMS y se elimina al terminar.
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  const name = `verify-${randomUUID()}.png`;
  const file = path.join(mediaDirectory(), name);
  try {
    fs.mkdirSync(mediaDirectory(), { recursive: true });
    fs.writeFileSync(file, png);
    const response = await fetch(`${media}/${name}`);
    const type = response.headers.get('content-type') || '';
    const corp = response.headers.get('cross-origin-resource-policy');
    if (response.status === 200 && type.startsWith('image/png') && corp === 'cross-origin') {
      ok('Imagen pública servida', `${type}, CORP ${corp}`);
    } else {
      fail('Imagen pública servida', `HTTP ${response.status}, tipo "${type}", CORP "${corp}". ¿FILE_STORAGE_PATH o MEDIA_PUBLIC_BASE_URL incorrectos?`);
    }
  } catch (error) {
    fail('Imagen pública servida', error.cause?.code || error.message);
  } finally {
    fs.rmSync(file, { force: true });
  }
}

async function expectStatus(label, url, init, expected) {
  try {
    const response = await fetch(url, init);
    if (response.status === expected) ok(label, `HTTP ${response.status}`);
    else fail(label, `HTTP ${response.status} (se esperaba ${expected})`);
    return response;
  } catch (error) {
    fail(label, error.cause?.code || error.message);
    return null;
  }
}

async function postflight() {
  const media = mediaBaseUrl();
  if (!media) return fail('MEDIA_PUBLIC_BASE_URL', 'falta');
  const api = media.replace(/\/media\/public$/, '');

  await waitForApi(api);
  await checkImagePublished(media);
  await expectStatus('Servicios públicos con imágenes', `${api}/public/services`, undefined, 200);
  await expectStatus('Informe de analítica exige sesión', `${api}/analytics/report?from=2026-01-01&to=2026-01-02`, undefined, 401);
  await expectStatus('CSV de analítica exige sesión', `${api}/analytics/export?from=2026-01-01&to=2026-01-02&report=pages`, undefined, 401);
  await expectStatus('Carga de imágenes exige sesión', `${api}/media/images`, { method: 'POST' }, 401);
  // Origen ajeno: se responde 202 pero no se guarda nada (no ensucia las estadísticas).
  const collect = await expectStatus(
    'Recepción de analítica activa',
    `${api}/analytics/collect`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', Origin: 'https://verificacion.invalid', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/141.0 Safari/537.36' },
      body: JSON.stringify({ events: [{ type: 'pageview', path: '/verificacion-despliegue' }] }),
    },
    202,
  );
  if (collect) {
    const body = await collect.json().catch(() => null);
    if (body?.data?.accepted === 0) ok('Origen ajeno descartado', 'accepted: 0');
    else fail('Origen ajeno descartado', JSON.stringify(body));
  }
  await runCrmChecks();
}

(async () => {
  const mode = process.argv[2];
  if (mode === 'preflight') await preflight();
  else if (mode === 'postflight') await postflight();
  else if (mode === 'crm') await runCrmChecks();
  else {
    console.error('Uso: node scripts/verify-deploy.js preflight|postflight|crm');
    process.exit(2);
  }
  console.log(failures ? `\nRESULTADO: ${failures} fallo(s).` : '\nRESULTADO: todo correcto.');
  process.exit(failures ? 1 : 0);
})();
