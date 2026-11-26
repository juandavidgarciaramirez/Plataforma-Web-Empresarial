/**
 * La migración 016 sobre bases desechables con el esquema de producción, y su
 * efecto real en PQR, chat y archivos con los repositorios compilados.
 */
const { after, before, describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('crypto');
const { spawnSync } = require('child_process');
const path = require('path');
require('reflect-metadata');
const {
  BACKEND_DIR,
  REPO_DIR,
  applyMigration,
  count,
  createDatabase,
  createProductionSchemaDatabase,
  readMigration,
  skipDatabaseTests,
  snapshot,
} = require('./helpers/scratch-db');

const MIGRATION = '016_platform_catalog_bootstrap.sql';
const VERIFY = '016_platform_catalog_bootstrap_verify.sql';
const TABLES = ['pqr.request_types', 'pqr.request_statuses', 'pqr.request_priorities', 'chat.chat_intents', 'foundation.storage_providers'];
const dist = (file) => require(path.join(BACKEND_DIR, 'dist', file));
const psqlMissing = spawnSync('psql', ['--version']).status === 0 ? false : 'psql no está instalado';

describe('migración 016_platform_catalog_bootstrap', { skip: skipDatabaseTests }, () => {
  let base;
  const open = [];

  const fresh = async () => {
    const db = await createDatabase('platform', base.name);
    open.push(db);
    return db;
  };
  const counts = async (db) => Promise.all(TABLES.map((table) => count(db, table)));
  const snapshots = async (db) => Promise.all(TABLES.map((table) => snapshot(db, table)));

  before(async () => {
    base = await createProductionSchemaDatabase('platform_base');
  });

  after(async () => {
    await Promise.all(open.map((db) => db.drop()));
    await base.drop();
  });

  test('en una base vacía crea los catálogos, sin rutas ni depender de la 015', async () => {
    const db = await fresh();
    assert.deepEqual(await counts(db), [0, 0, 0, 0, 0]);
    assert.equal(await count(db, 'crm.lead_sources'), 0);

    await applyMigration(db, MIGRATION);

    assert.deepEqual(await counts(db), [5, 8, 4, 13, 1]);
    const [provider] = await db.rows('SELECT name, provider_type, bucket_name, endpoint, is_default, is_active FROM foundation.storage_providers');
    assert.deepEqual({ ...provider }, {
      name: 'Local Storage', provider_type: 'LOCAL', bucket_name: null, endpoint: null, is_default: true, is_active: true,
    });
    const closed = await db.rows('SELECT code FROM pqr.request_statuses WHERE is_closed ORDER BY code');
    assert.deepEqual(closed.map((row) => row.code), ['CLOSED', 'REJECTED']);
  });

  test('es idempotente: repetirla no cambia ninguna fila', async () => {
    const db = await fresh();
    await applyMigration(db, MIGRATION);
    const firstRun = await snapshots(db);

    await applyMigration(db, MIGRATION);
    await applyMigration(db, MIGRATION);

    assert.deepEqual(await snapshots(db), firstRun);
  });

  test('se puede revertir: cambiar COMMIT por ROLLBACK no deja cambios', async () => {
    const db = await fresh();
    await db.query(readMigration(MIGRATION).replace(/^COMMIT;\r?$/m, 'ROLLBACK;'));
    assert.deepEqual(await counts(db), [0, 0, 0, 0, 0]);
  });

  test('no modifica registros existentes y completa solo lo que falta', async () => {
    const db = await fresh();
    await db.query(`INSERT INTO pqr.request_types (code, name, sort_order) VALUES ('QUEJA', 'Nombre propio', 9)`);
    await db.query(`INSERT INTO pqr.request_statuses (code, name, is_closed) VALUES ('CLOSED', 'Finalizada', true)`);
    await db.query(`INSERT INTO chat.chat_intents (code, name, is_active) VALUES ('QUOTE', 'Presupuesto', false)`);

    await applyMigration(db, MIGRATION);

    assert.deepEqual(await counts(db), [5, 8, 4, 13, 1]);
    assert.equal((await db.rows(`SELECT name FROM pqr.request_types WHERE code = 'QUEJA'`))[0].name, 'Nombre propio');
    assert.equal((await db.rows(`SELECT name FROM pqr.request_statuses WHERE code = 'CLOSED'`))[0].name, 'Finalizada');
    assert.equal((await db.rows(`SELECT is_active FROM chat.chat_intents WHERE code = 'QUOTE'`))[0].is_active, false);
  });

  test('si ya hay un proveedor de almacenamiento, aunque esté inactivo, no agrega otro', async () => {
    const db = await fresh();
    await db.query(`INSERT INTO foundation.storage_providers (name, provider_type, is_default, is_active) VALUES ('S3 propio', 'S3', false, false)`);
    const providers = await snapshot(db, 'foundation.storage_providers');

    await applyMigration(db, MIGRATION);

    assert.equal(await snapshot(db, 'foundation.storage_providers'), providers);
  });

  describe('ejecutada con psql y un cliente que no usa UTF-8', { skip: psqlMissing }, () => {
    for (const encoding of ['LATIN1', 'WIN1252']) {
      test(`${encoding}: los nombres con acentos entran bien`, async () => {
        const db = await fresh();
        const psql = (file) =>
          spawnSync('psql', [db.url, '-q', '-v', 'ON_ERROR_STOP=1', '-f', path.join(REPO_DIR, 'database', 'migrations', file)], {
            encoding: 'utf8',
            env: { ...process.env, PGCLIENTENCODING: encoding },
          });

        const run = psql(MIGRATION);

        assert.equal(run.status, 0, run.stderr);
        assert.equal(await count(db, 'pqr.request_types', `name = 'Petición'`), 1);
        assert.equal(await count(db, 'pqr.request_statuses', `name = 'En revisión'`), 1);
        assert.equal(await count(db, 'chat.chat_intents', `name = 'Cotización'`), 1);
        const verified = psql(VERIFY);
        assert.equal(verified.status, 0, verified.stderr);
      });
    }
  });

  describe('016_platform_catalog_bootstrap_verify.sql', () => {
    test('falla con catálogos vacíos', async () => {
      const db = await fresh();
      await assert.rejects(applyMigration(db, VERIFY), /FALLO: faltan tipos en pqr\.request_types/);
    });

    test('pasa tras la migración y no escribe nada', async () => {
      const db = await fresh();
      await applyMigration(db, MIGRATION);
      const beforeRun = await snapshots(db);

      await applyMigration(db, VERIFY);

      assert.deepEqual(await snapshots(db), beforeRun);
    });

    test('detecta un código requerido que falta', async () => {
      const db = await fresh();
      await applyMigration(db, MIGRATION);
      await db.query(`DELETE FROM pqr.request_priorities WHERE code = 'MEDIUM'`);
      await assert.rejects(applyMigration(db, VERIFY), /falta la prioridad MEDIUM/);
    });
  });
});

describe('efecto de la 016 en la aplicación', { skip: skipDatabaseTests }, () => {
  let db;
  let prisma;
  let pqr;
  let chat;
  let files;

  const pqrData = () => ({
    type: 'PETICION',
    fullName: 'Ana Ruiz',
    email: 'ana@ejemplo.co',
    phone: null,
    company: null,
    documentType: null,
    documentNumber: null,
    subject: 'Asunto',
    description: 'Descripción',
    attachmentUrl: null,
    status: 'OPEN',
    response: null,
    respondedAt: null,
  });

  before(async () => {
    db = await createProductionSchemaDatabase('platform_app');
    // Columnas de PQR posteriores al volcado de producción.
    for (const file of ['008_blog_news_content.sql', '009_notifications.sql', '010_pqr_careers_real_persistence.sql']) {
      await applyMigration(db, file);
    }
    process.env.DATABASE_URL = db.url;

    const { PrismaService } = dist('database/prisma/prisma.service.js');
    const { PrismaPqrRepository } = dist('modules/pqr/repositories/prisma-pqr.repository.js');
    const { PrismaChatRepository } = dist('modules/chat/repositories/prisma-chat.repository.js');
    const { PrismaFileRepository } = dist('modules/files/repositories/prisma-file.repository.js');

    prisma = new PrismaService();
    const [{ current_database: connected }] = await prisma.$queryRaw`SELECT current_database()`;
    assert.equal(connected, db.name, 'las pruebas deben escribir solo en la base desechable');

    pqr = new PrismaPqrRepository(prisma);
    chat = new PrismaChatRepository(prisma);
    files = new PrismaFileRepository(prisma);
  });

  after(async () => {
    await prisma?.$disconnect();
    await db?.drop();
  });

  // Se ejecutan en orden: primero sin catálogos, después con la 016 aplicada.
  test('sin catálogos, la PQR falla indicando la migración y no deja la solicitud', async () => {
    const { CrmSetupError } = dist('modules/crm/common/crm-db.util.js');
    await assert.rejects(
      pqr.create(pqrData()),
      (error) => error instanceof CrmSetupError && /016_platform_catalog_bootstrap\.sql/.test(error.message),
    );
    assert.equal(await count(db, 'pqr.requests'), 0);
  });

  test('sin catálogos, Yuri no guarda la intención y los archivos no tienen proveedor', async () => {
    const session = await chat.upsert(randomUUID(), { intent: 'quote' });
    assert.equal(session.intent, null);
    assert.equal(await files.resolveDefaultStorageProviderId(), null);
  });

  test('tras la 016, sin reiniciar, la PQR se radica y se resuelven intención y proveedor', async () => {
    await applyMigration(db, MIGRATION);

    const created = await pqr.create(pqrData());
    assert.match(created.radicado, /^PQR-/);
    assert.equal(created.type, 'PETICION');
    assert.equal(created.status, 'OPEN');

    for (const type of ['QUEJA', 'RECLAMO', 'SUGERENCIA', 'FELICITACION']) {
      assert.equal((await pqr.create({ ...pqrData(), type })).type, type);
    }

    const session = await chat.upsert(randomUUID(), { intent: 'quote' });
    assert.equal(session.intent, 'quote');

    const [provider] = await db.rows('SELECT id FROM foundation.storage_providers');
    assert.equal(String(await files.resolveDefaultStorageProviderId()), provider.id);
  });
});
