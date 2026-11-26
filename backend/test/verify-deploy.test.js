/**
 * `scripts/verify-deploy.js` y el seed de seguridad como los ejecuta el servidor:
 * procesos aparte, sobre bases desechables y desde una carpeta sin .env.
 */
const { after, before, describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const bcrypt = require('bcryptjs');
const {
  BACKEND_DIR,
  applyBootstrap,
  applyMigration,
  count,
  createDatabase,
  createProductionSchemaDatabase,
  insertAdmin,
  skipDatabaseTests,
  snapshot,
} = require('./helpers/scratch-db');

const catalog = require('../src/modules/crm/common/crm-catalog.json');

const ADMIN_EMAIL = 'qa-admin-secreto@example.invalid';
const JWT_SECRET = 'jwt-secreto-que-no-debe-aparecer';
const VERIFY_SCRIPT = path.join(BACKEND_DIR, 'scripts', 'verify-deploy.js');

describe('verify-deploy.js', { skip: skipDatabaseTests }, () => {
  let base;
  let workDir;
  const open = [];

  const fresh = async () => {
    const db = await createDatabase('verify', base.name);
    open.push(db);
    return db;
  };

  /** Base lista: migración aplicada y administrador real. */
  const ready = async () => {
    const db = await fresh();
    await applyBootstrap(db);
    await insertAdmin(db, ADMIN_EMAIL);
    return db;
  };

  const runVerify = (db, mode = 'crm', env = {}) => {
    const result = spawnSync(process.execPath, [VERIFY_SCRIPT, mode], {
      cwd: workDir,
      encoding: 'utf8',
      env: {
        PATH: process.env.PATH,
        SystemRoot: process.env.SystemRoot,
        DATABASE_URL: db.url,
        SEED_ADMIN_EMAIL: ADMIN_EMAIL,
        JWT_ACCESS_SECRET: JWT_SECRET,
        JWT_REFRESH_SECRET: JWT_SECRET,
        ...env,
      },
    });
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  };

  before(async () => {
    base = await createProductionSchemaDatabase('verify_base');
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-deploy-'));
  });

  after(async () => {
    await Promise.all(open.map((db) => db.drop()));
    await base.drop();
    fs.rmSync(workDir, { recursive: true, force: true });
  });

  test('pasa con el catálogo completo y muestra los mensajes acordados', async () => {
    const { status, output } = runVerify(await ready());
    assert.equal(status, 0, output);
    for (const line of [
      'OK Lead sources',
      'OK Lead statuses',
      'OK Default pipeline',
      'OK Pipeline stages',
      'OK No-company placeholder',
      'OK CRM administrator',
      'OK CRM catalog ready',
    ]) {
      assert.match(output, new RegExp(`^${line}`, 'm'), `falta "${line}"`);
    }
    assert.match(output, /^OK Correspondencia aplicación-PostgreSQL/m);
    assert.match(output, /^OK Lead relations/m);
    assert.match(output, /^OK Default country/m);
  });

  test('con catálogos vacíos falla e indica qué falta, qué migración, qué archivo y qué verificar', async () => {
    const db = await fresh();
    await insertAdmin(db, ADMIN_EMAIL);
    const { status, output } = runVerify(db);

    assert.equal(status, 1, output);
    assert.match(output, /^FALLO Lead sources — faltan en crm\.lead_sources: Sitio Web/m);
    assert.match(output, /^FALLO Lead statuses — faltan en crm\.lead_statuses: Nuevo/m);
    assert.match(output, /^FALLO Default pipeline — falta "Ventas" en crm\.pipelines/m);
    assert.match(output, /^FALLO No-company placeholder/m);
    assert.match(output, /Migración: 015_crm_catalog_bootstrap/);
    assert.match(output, /Archivo: database\/migrations\/015_crm_catalog_bootstrap\.sql/);
    assert.match(output, /Después: node scripts\/verify-deploy\.js crm/);
    assert.match(output, /^FALLO CRM catalog ready/m);
    assert.doesNotMatch(output, /^OK CRM catalog ready/m);
  });

  test('una sola fuente faltante se nombra', async () => {
    const db = await ready();
    await db.query(`DELETE FROM crm.lead_sources WHERE name = 'Yuri (Chatbot)'`);
    const { status, output } = runVerify(db);
    assert.equal(status, 1);
    assert.match(output, /faltan en crm\.lead_sources: Yuri \(Chatbot\)/);
    assert.match(output, /Correspondencia aplicación-PostgreSQL — la aplicación usa registros inexistentes: fuente YURI/);
  });

  test('no exige que crm.leads esté vacío', async () => {
    const db = await ready();
    await db.query(
      `INSERT INTO core.contacts (company_id, first_name, last_name)
       SELECT id, 'Ana', 'Real' FROM core.companies LIMIT 1`,
    );
    await db.query(
      `INSERT INTO crm.leads (code, contact_id, assigned_to, created_by, source_id, status_id, pipeline_id, stage_id, title)
       SELECT 'LEAD-REAL-1', c.id, u.id, u.id, so.id, st.id, p.id, ps.id, 'Lead real'
         FROM core.contacts c, security.users u, crm.lead_sources so, crm.lead_statuses st, crm.pipelines p, crm.pipeline_stages ps
        WHERE so.name = 'Yuri (Chatbot)' AND st.name = 'Nuevo' AND p.name = 'Ventas' AND ps.pipeline_id = p.id AND ps.name = 'Nuevo'`,
    );
    const { status, output } = runVerify(db);
    assert.equal(status, 0, output);
  });

  test('solo lee: no cambia ninguna fila', async () => {
    const db = await ready();
    const tables = ['crm.lead_sources', 'crm.lead_statuses', 'crm.pipelines', 'crm.pipeline_stages', 'core.companies', 'security.users'];
    const beforeRun = await Promise.all(tables.map((table) => snapshot(db, table)));
    runVerify(db);
    assert.deepEqual(await Promise.all(tables.map((table) => snapshot(db, table))), beforeRun);
  });

  test('detecta más de un pipeline predeterminado y remite a la decisión manual', async () => {
    const db = await ready();
    await db.query(`INSERT INTO crm.pipelines (name, is_default, is_active) VALUES ('Otro', true, true)`);
    const { status, output } = runVerify(db);
    assert.equal(status, 1);
    assert.match(output, /^FALLO Default pipeline — debe haber exactamente un predeterminado activo y hay 2: Ventas, Otro/m);
    assert.match(output, /se detiene ante esta contradicción/);
  });

  test('detecta una etapa ausente', async () => {
    const db = await ready();
    await db.query(`DELETE FROM crm.pipeline_stages WHERE name = 'Calificado'`);
    const { status, output } = runVerify(db);
    assert.equal(status, 1);
    assert.match(output, /faltan en crm\.pipeline_stages: Calificado/);
    assert.match(output, /etapa de QUALIFIED -> "Calificado"/);
  });

  test('un stage_order distinto solo avisa', async () => {
    const db = await ready();
    await db.query(`UPDATE crm.pipeline_stages SET stage_order = 7 WHERE name = 'Perdido'`);
    const { status, output } = runVerify(db);
    assert.equal(status, 0, output);
    assert.match(output, /^AVISO Pipeline stages — otro stage_order \(válido, no se modifica\): Perdido=7 \(referencia 4\)/m);
  });

  test('detecta la falta del administrador sin imprimir su correo', async () => {
    const db = await fresh();
    await applyBootstrap(db);
    const { status, output } = runVerify(db);
    assert.equal(status, 1);
    assert.match(output, /^FALLO CRM administrator — el usuario de SEED_ADMIN_EMAIL no existe/m);
    assert.match(output, /npm run seed:security/);
    assert.ok(!output.includes(ADMIN_EMAIL));
  });

  test('detecta SEED_ADMIN_EMAIL sin definir y un administrador inactivo', async () => {
    const db = await ready();
    const undefinedEmail = runVerify(db, 'crm', { SEED_ADMIN_EMAIL: '' });
    assert.equal(undefinedEmail.status, 1);
    assert.match(undefinedEmail.output, /^FALLO CRM administrator — SEED_ADMIN_EMAIL no está definido/m);

    await db.query(`UPDATE security.users SET status = 'INACTIVE'`);
    const inactive = runVerify(db);
    assert.equal(inactive.status, 1);
    assert.match(inactive.output, /eliminado o no está activo/);
  });

  test('avisa si faltan los catálogos de la 016, sin bloquear, y deja de avisar al aplicarla', async () => {
    const db = await ready();
    const before016 = runVerify(db);
    assert.equal(before016.status, 0, before016.output);
    assert.match(before016.output, /^AVISO Catálogo pqr\.request_types — faltan PETICION.*la radicación de PQR falla\. Ejecutar database\/migrations\/016_platform_catalog_bootstrap\.sql/m);
    assert.match(before016.output, /^AVISO Catálogo pqr\.request_priorities — faltan MEDIUM/m);
    assert.match(before016.output, /^AVISO Catálogo chat\.chat_intents — faltan GREETING/m);
    assert.match(before016.output, /^AVISO Catálogo foundation\.storage_providers — vacío/m);

    await applyMigration(db, '016_platform_catalog_bootstrap.sql');

    const after016 = runVerify(db);
    assert.equal(after016.status, 0, after016.output);
    assert.doesNotMatch(after016.output, /^AVISO Catálogo/m);
  });

  test('un código de PQR que falta se nombra', async () => {
    const db = await ready();
    await applyMigration(db, '016_platform_catalog_bootstrap.sql');
    await db.query(`DELETE FROM pqr.request_statuses WHERE code = 'RECEIVED'`);
    assert.match(runVerify(db).output, /^AVISO Catálogo pqr\.request_statuses — faltan RECEIVED:/m);
  });

  test('proveedores de almacenamiento desactivados: avisa sin proponer la 016, que no los tocaría', async () => {
    const db = await ready();
    await db.query(`INSERT INTO foundation.storage_providers (name, is_active) VALUES ('S3', false)`);
    const { output } = runVerify(db);
    assert.match(output, /^AVISO Catálogo foundation\.storage_providers — todos los proveedores están desactivados/m);
  });

  test('avisa si falta la empresa propia, sin bloquear', async () => {
    const db = await ready();
    const missing = runVerify(db);
    assert.equal(missing.status, 0, missing.output);
    assert.match(missing.output, /^AVISO Empresa propia .* fallan las postulaciones, los adjuntos de PQR y la carga de imágenes/m);

    await db.query(
      `INSERT INTO core.companies (country_id, legal_name) SELECT id, $1 FROM core.countries WHERE iso2 = 'CO'`,
      [catalog.ownCompany.legalName.toUpperCase()],
    );
    assert.doesNotMatch(runVerify(db).output, /^AVISO Empresa propia/m);
  });

  test('lee SEED_ADMIN_EMAIL de un .env con comillas y fin de línea CRLF, como en el servidor', async () => {
    const db = await ready();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-env-'));
    try {
      fs.writeFileSync(path.join(dir, '.env'), `NODE_ENV=production\r\nSEED_ADMIN_EMAIL="${ADMIN_EMAIL}"\r\n`);
      const result = spawnSync(process.execPath, [VERIFY_SCRIPT, 'crm'], {
        cwd: dir,
        encoding: 'utf8',
        env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, DATABASE_URL: db.url },
      });
      assert.equal(result.status, 0, result.stdout);
      assert.match(result.stdout, /^OK CRM administrator/m);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test('nunca imprime contraseñas, DATABASE_URL, secretos ni el correo del administrador', async () => {
    const db = await ready();
    const password = new URL(db.url).password;
    for (const mode of ['crm', 'preflight']) {
      const { output } = runVerify(db, mode);
      assert.ok(!output.includes(db.url), mode);
      assert.ok(!output.includes(JWT_SECRET), mode);
      assert.ok(!output.includes(ADMIN_EMAIL), mode);
      if (password.length > 3) assert.ok(!output.includes(`:${password}@`), mode);
    }
    const broken = runVerify(db, 'crm', { DATABASE_URL: 'postgresql://usuario:clave-erronea@127.0.0.1:1/nada' });
    assert.equal(broken.status, 1);
    assert.ok(!broken.output.includes('clave-erronea'), broken.output);
  });

  test('preflight incluye las comprobaciones del CRM', async () => {
    const { output } = runVerify(await ready(), 'preflight');
    assert.match(output, /^OK CRM catalog ready/m);
  });
});

describe('seed de seguridad (production-seed)', { skip: skipDatabaseTests }, () => {
  const PASSWORD = 'clave-de-prueba-1234';
  let db;
  let workDir;

  const runSeed = (env = {}) => {
    const result = spawnSync(process.execPath, [path.join(BACKEND_DIR, 'dist', 'database', 'production-seed.js')], {
      cwd: workDir,
      encoding: 'utf8',
      env: {
        PATH: process.env.PATH,
        SystemRoot: process.env.SystemRoot,
        DATABASE_URL: db.url,
        SEED_ADMIN_EMAIL: ADMIN_EMAIL,
        SEED_ADMIN_PASSWORD: PASSWORD,
        ...env,
      },
    });
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  };

  before(async () => {
    db = await createProductionSchemaDatabase('seed');
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'seed-'));
  });

  after(async () => {
    await db.drop();
    fs.rmSync(workDir, { recursive: true, force: true });
  });

  test('crea roles, permisos y administrador, sin datos comerciales ni secretos en la salida', async () => {
    const { status, output } = runSeed();
    assert.equal(status, 0, output);
    assert.match(output, /Administrador: creado/);
    assert.ok(!output.includes(PASSWORD));
    assert.ok(!output.includes(ADMIN_EMAIL));

    const [admin] = await db.rows(
      `SELECT u.status, u.deleted_at, u.password_hash, r.name AS role FROM security.users u
         JOIN security.roles r ON r.id = u.role_id WHERE u.email = $1`,
      [ADMIN_EMAIL],
    );
    assert.equal(admin.status, 'ACTIVE');
    assert.equal(admin.role, 'Administrador');
    assert.equal(await bcrypt.compare(PASSWORD, admin.password_hash), true);

    assert.equal(await count(db, 'crm.lead_sources'), 0, 'el seed de seguridad no siembra catálogos comerciales');
    assert.equal(await count(db, 'core.companies'), 0);
    assert.equal(await count(db, 'crm.leads'), 0);
  });

  test('es idempotente y no cambia la contraseña de un usuario existente', async () => {
    const usersBefore = await snapshot(db, 'security.users');
    const permissionsBefore = await count(db, 'security.permissions');
    const grantsBefore = await count(db, 'security.role_permissions');

    const { status, output } = runSeed({ SEED_ADMIN_PASSWORD: 'otra-clave-distinta' });

    assert.equal(status, 0, output);
    assert.match(output, /Administrador: ya existe, no se modifica/);
    assert.equal(await snapshot(db, 'security.users'), usersBefore);
    assert.equal(await count(db, 'security.permissions'), permissionsBefore);
    assert.equal(await count(db, 'security.role_permissions'), grantsBefore);
  });

  test('sin SEED_ADMIN_PASSWORD no crea un usuario nuevo y lo explica', async () => {
    const { status, output } = runSeed({ SEED_ADMIN_EMAIL: 'nuevo@example.invalid', SEED_ADMIN_PASSWORD: '' });
    assert.equal(status, 1);
    assert.match(output, /SEED_ADMIN_PASSWORD no está definido/);
    assert.equal(await count(db, 'security.users', `email = 'nuevo@example.invalid'`), 0);
  });
});
