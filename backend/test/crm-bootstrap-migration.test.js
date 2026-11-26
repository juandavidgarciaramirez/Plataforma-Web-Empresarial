/**
 * La migración 015 sobre bases desechables con el esquema de producción.
 * La sintaxis y las funciones usadas son de PostgreSQL 10, pero estas pruebas
 * corren en la versión instalada localmente: el ensayo con ROLLBACK en el
 * servidor sigue siendo la primera ejecución real en PostgreSQL 10.
 */
const { after, before, describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('child_process');
const path = require('path');
const {
  REPO_DIR,
  applyBootstrap,
  applyMigration,
  count,
  createDatabase,
  createProductionSchemaDatabase,
  insertAdmin,
  readMigration,
  skipDatabaseTests,
  snapshot,
} = require('./helpers/scratch-db');

const CATALOG_TABLES = ['crm.lead_sources', 'crm.lead_statuses', 'crm.pipelines', 'crm.pipeline_stages', 'core.countries', 'core.companies'];
const PLACEHOLDER = `lower(legal_name) = lower('Contactos Independientes (Sin Empresa)')`;
const psqlMissing = spawnSync('psql', ['--version']).status === 0 ? false : 'psql no está instalado';

/** Ejecuta un archivo con psql, como en el servidor, con otra codificación de cliente. */
const psqlFile = (db, file, env = {}) =>
  spawnSync('psql', [db.url, '-q', '-v', 'ON_ERROR_STOP=1', '-f', path.join(REPO_DIR, 'database', 'migrations', file)], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });

describe('migración 015_crm_catalog_bootstrap', { skip: skipDatabaseTests }, () => {
  let base;
  const open = [];

  /** Copia limpia del esquema para cada escenario. */
  const fresh = async () => {
    const db = await createDatabase('migration', base.name);
    open.push(db);
    return db;
  };

  const catalogCounts = async (db) => ({
    sources: await count(db, 'crm.lead_sources'),
    statuses: await count(db, 'crm.lead_statuses'),
    pipelines: await count(db, 'crm.pipelines'),
    stages: await count(db, 'crm.pipeline_stages'),
    placeholders: await count(db, 'core.companies', PLACEHOLDER),
  });

  const insertCountry = (db) =>
    db.query(`INSERT INTO core.countries (iso2, iso3, name) VALUES ('CO', 'COL', 'Colombia')`);

  /** La migración falla con ese motivo y no deja ningún cambio. */
  const assertStops = async (db, reason) => {
    const before_ = await Promise.all(CATALOG_TABLES.map((table) => snapshot(db, table)));
    await assert.rejects(applyBootstrap(db), reason);
    assert.deepEqual(await Promise.all(CATALOG_TABLES.map((table) => snapshot(db, table))), before_);
  };

  before(async () => {
    base = await createProductionSchemaDatabase('migration_base');
  });

  after(async () => {
    await Promise.all(open.map((db) => db.drop()));
    await base.drop();
  });

  test('en una base con catálogos vacíos crea exactamente lo requerido', async () => {
    const db = await fresh();
    assert.deepEqual(await catalogCounts(db), { sources: 0, statuses: 0, pipelines: 0, stages: 0, placeholders: 0 });

    await applyBootstrap(db);

    assert.deepEqual(await catalogCounts(db), { sources: 14, statuses: 10, pipelines: 1, stages: 5, placeholders: 1 });

    const stages = await db.rows(
      `SELECT s.stage_order, s.name, s.is_closed, s.is_success, p.name AS pipeline, p.is_default, p.is_active
         FROM crm.pipeline_stages s JOIN crm.pipelines p ON p.id = s.pipeline_id ORDER BY s.stage_order`,
    );
    assert.deepEqual(stages.map((s) => [s.stage_order, s.name, s.is_closed, s.is_success]), [
      [1, 'Nuevo', false, false],
      [2, 'Contactado', false, false],
      [3, 'Calificado', false, false],
      [4, 'Perdido', true, false],
      [5, 'Ganado', true, true],
    ]);
    assert.ok(stages.every((s) => s.pipeline === 'Ventas' && s.is_default && s.is_active));

    const [company] = await db.rows(
      `SELECT c.commercial_name, co.iso2 FROM core.companies c JOIN core.countries co ON co.id = c.country_id WHERE ${PLACEHOLDER}`,
    );
    assert.deepEqual({ ...company }, { commercial_name: 'Sin Empresa', iso2: 'CO' });
    assert.equal(await count(db, 'crm.leads'), 0, 'no crea datos de demostración');
    assert.equal(await count(db, 'core.contacts'), 0, 'no crea datos de demostración');
    assert.equal(await count(db, 'core.companies'), 1, 'solo la empresa técnica');
  });

  test('es idempotente: la segunda ejecución no falla ni cambia ninguna fila', async () => {
    const db = await fresh();
    await applyBootstrap(db);
    const firstRun = await Promise.all(CATALOG_TABLES.map((table) => snapshot(db, table)));

    await applyBootstrap(db);
    await applyBootstrap(db);

    assert.deepEqual(await Promise.all(CATALOG_TABLES.map((table) => snapshot(db, table))), firstRun);
  });

  test('se puede revertir: cambiar COMMIT por ROLLBACK no deja cambios', async () => {
    const db = await fresh();
    const sql = readMigration('015_crm_catalog_bootstrap.sql').replace(/^COMMIT;\r?$/m, 'ROLLBACK;');
    assert.ok(sql.includes('ROLLBACK;'));

    await db.query(sql);

    assert.deepEqual(await catalogCounts(db), { sources: 0, statuses: 0, pipelines: 0, stages: 0, placeholders: 0 });
    assert.equal(await count(db, 'core.countries'), 0);
  });

  test('corre en un estado parcial sin duplicar lo que ya existe', async () => {
    const db = await fresh();
    await db.query(`INSERT INTO crm.lead_sources (name, sort_order) VALUES ('Sitio Web', 1), ('PQR', 14)`);
    await db.query(`INSERT INTO crm.lead_statuses (name, sort_order) VALUES ('Nuevo', 1)`);

    await applyBootstrap(db);

    assert.deepEqual(await catalogCounts(db), { sources: 14, statuses: 10, pipelines: 1, stages: 5, placeholders: 1 });
  });

  test('no modifica ningún registro existente: catálogos, empresas, contactos ni leads', async () => {
    const db = await fresh();
    await applyBootstrap(db);
    await insertAdmin(db, 'admin-preservado@example.invalid');

    // Personalizaciones y datos reales que una instalación puede tener.
    await db.query(`UPDATE crm.lead_sources SET description = 'Texto editado', is_active = false WHERE name = 'WhatsApp'`);
    await db.query(`UPDATE crm.lead_statuses SET color = '#000000' WHERE name = 'Nuevo'`);
    await db.query(`UPDATE crm.pipelines SET description = 'Descripción propia'`);
    await db.query(`UPDATE crm.pipeline_stages SET probability = 55 WHERE name = 'Calificado'`);
    await db.query(`INSERT INTO crm.lead_sources (name, sort_order) VALUES ('Feria Comercial', 15)`);
    await db.query(`INSERT INTO crm.pipelines (name, is_default, is_active) VALUES ('Renovaciones', false, true)`);
    await db.query(
      `INSERT INTO core.companies (country_id, legal_name) SELECT id, 'Cliente Real SAS' FROM core.countries WHERE iso2 = 'CO'`,
    );
    await db.query(
      `INSERT INTO core.contacts (company_id, first_name, last_name, email)
       SELECT id, 'Ana', 'Real', 'ana@cliente-real.invalid' FROM core.companies WHERE legal_name = 'Cliente Real SAS'`,
    );
    await db.query(
      `INSERT INTO crm.leads (code, contact_id, assigned_to, created_by, source_id, status_id, pipeline_id, stage_id, title)
       SELECT 'LEAD-REAL-1', c.id, u.id, u.id, so.id, st.id, p.id, ps.id, 'Lead real'
         FROM core.contacts c, security.users u, crm.lead_sources so, crm.lead_statuses st, crm.pipelines p, crm.pipeline_stages ps
        WHERE so.name = 'Referido' AND st.name = 'Negociación' AND p.name = 'Ventas' AND ps.pipeline_id = p.id AND ps.name = 'Calificado'`,
    );

    const tables = [...CATALOG_TABLES, 'core.contacts', 'crm.leads'];
    const beforeRun = await Promise.all(tables.map((table) => snapshot(db, table)));

    await applyBootstrap(db);

    assert.deepEqual(await Promise.all(tables.map((table) => snapshot(db, table))), beforeRun);
  });

  test('admite pipelines adicionales que no son predeterminados', async () => {
    const db = await fresh();
    await db.query(`INSERT INTO crm.pipelines (name, is_default, is_active) VALUES ('Renovaciones', false, true)`);

    await applyBootstrap(db);

    const pipelines = await db.rows(`SELECT name, is_default, is_active FROM crm.pipelines ORDER BY name`);
    assert.deepEqual(pipelines.map((p) => [p.name, p.is_default, p.is_active]), [
      ['Renovaciones', false, true],
      ['Ventas', true, true],
    ]);
  });

  test('acepta una instalación con etapas adicionales y otro stage_order sin cambiarlas', async () => {
    // Estado real de la base de desarrollo: 7 etapas, con Ganado=6 y Perdido=7.
    const db = await fresh();
    await db.query(`INSERT INTO crm.pipelines (name, is_default, is_active) VALUES ('Ventas', true, true)`);
    await db.query(
      `INSERT INTO crm.pipeline_stages (pipeline_id, name, stage_order, is_closed, is_success)
       SELECT p.id, v.name, v.ord, v.closed, v.success FROM crm.pipelines p,
       (VALUES ('Nuevo', 1, false, false), ('Contactado', 2, false, false), ('Calificado', 3, false, false),
               ('Propuesta', 4, false, false), ('Negociación', 5, false, false),
               ('Ganado', 6, true, true), ('Perdido', 7, true, false)) AS v(name, ord, closed, success)`,
    );
    const stagesBefore = await snapshot(db, 'crm.pipeline_stages');

    await applyBootstrap(db);

    assert.equal(await snapshot(db, 'crm.pipeline_stages'), stagesBefore);
  });

  describe('se detiene con un error descriptivo ante estados contradictorios', () => {
    test('dos pipelines predeterminados', async () => {
      const db = await fresh();
      await db.query(`INSERT INTO crm.pipelines (name, is_default, is_active) VALUES ('Ventas', true, true), ('Otro', true, true)`);
      await assertStops(db, /hay 2 pipelines predeterminados activos: Otro, Ventas/);
    });

    test('un predeterminado con otro nombre', async () => {
      const db = await fresh();
      await db.query(`INSERT INTO crm.pipelines (name, is_default, is_active) VALUES ('Comercial', true, true)`);
      await assertStops(db, /el pipeline predeterminado es "Comercial", se esperaba "Ventas"/);
    });

    test('un predeterminado desactivado', async () => {
      const db = await fresh();
      await db.query(`INSERT INTO crm.pipelines (name, is_default, is_active) VALUES ('Ventas', true, false)`);
      await assertStops(db, /pipeline predeterminado desactivado: Ventas/);
    });

    test('Ventas existe pero no es el predeterminado', async () => {
      const db = await fresh();
      await db.query(`INSERT INTO crm.pipelines (name, is_default, is_active) VALUES ('Ventas', false, true)`);
      await assertStops(db, /"Ventas" existe pero no es el predeterminado activo/);
    });

    const withVentas = async () => {
      const db = await fresh();
      await db.query(`INSERT INTO crm.pipelines (name, is_default, is_active) VALUES ('Ventas', true, true)`);
      return db;
    };

    test('una etapa con indicadores contradictorios', async () => {
      const db = await withVentas();
      await db.query(
        `INSERT INTO crm.pipeline_stages (pipeline_id, name, stage_order, is_closed, is_success)
         SELECT id, 'Ganado', 5, false, false FROM crm.pipelines`,
      );
      await assertStops(db, /etapa "Ganado" con is_closed\/is_success distintos/);
    });

    test('una etapa duplicada', async () => {
      const db = await withVentas();
      await db.query(
        `INSERT INTO crm.pipeline_stages (pipeline_id, name, stage_order)
         SELECT id, 'Nuevo', o FROM crm.pipelines, generate_series(1, 2) AS o`,
      );
      await assertStops(db, /etapa "Nuevo" duplicada/);
    });

    test('una etapa faltante cuyo stage_order ya está ocupado', async () => {
      const db = await withVentas();
      await db.query(
        `INSERT INTO crm.pipeline_stages (pipeline_id, name, stage_order) SELECT id, 'Propuesta', 4 FROM crm.pipelines`,
      );
      await assertStops(db, /falta la etapa "Perdido" y su stage_order 4 ya lo usa "Propuesta"/);
    });

    test('la empresa placeholder duplicada', async () => {
      const db = await fresh();
      await insertCountry(db);
      await db.query(
        `INSERT INTO core.companies (country_id, legal_name)
         SELECT c.id, v.name FROM core.countries c,
         (VALUES ('Contactos Independientes (Sin Empresa)'), ('CONTACTOS INDEPENDIENTES (SIN EMPRESA)')) AS v(name)`,
      );
      await assertStops(db, /empresa placeholder .* está duplicada \(2 filas\)/);
    });

    test('un país que ocupa iso3 COL con otro iso2', async () => {
      const db = await fresh();
      await db.query(`INSERT INTO core.countries (iso2, iso3, name) VALUES ('XX', 'COL', 'Otro')`);
      await assertStops(db, /no se pudo garantizar el país con iso2 = CO/);
    });
  });

  describe('ejecutada con psql y un cliente que no usa UTF-8', { skip: psqlMissing }, () => {
    for (const encoding of ['LATIN1', 'WIN1252']) {
      test(`${encoding}: los nombres con acentos entran bien y no se duplican`, async () => {
        const db = await fresh();
        await db.query(`INSERT INTO crm.lead_sources (name, sort_order) VALUES ('Correo Electrónico', 3)`);

        const run = psqlFile(db, '015_crm_catalog_bootstrap.sql', { PGCLIENTENCODING: encoding });

        assert.equal(run.status, 0, run.stderr);
        assert.equal(await count(db, 'crm.lead_sources'), 14);
        assert.equal(await count(db, 'crm.lead_sources', `name = 'Correo Electrónico'`), 1);
        assert.equal(await count(db, 'crm.lead_sources', `name = 'Teléfono'`), 1);
        assert.equal(await count(db, 'crm.lead_statuses', `name = 'En Gestión'`), 1);
        assert.equal(await count(db, 'crm.lead_statuses', `name = 'Negociación'`), 1);

        await insertAdmin(db, 'admin-psql@example.invalid');
        const verified = psqlFile(db, '015_crm_catalog_bootstrap_verify.sql', { PGCLIENTENCODING: encoding });
        assert.equal(verified.status, 0, verified.stderr);
      });
    }
  });

  test('una empresa placeholder existente no se duplica', async () => {
    const db = await fresh();
    await insertCountry(db);
    await db.query(
      `INSERT INTO core.companies (country_id, legal_name) SELECT id, 'Contactos Independientes (Sin Empresa)' FROM core.countries`,
    );
    await applyBootstrap(db);
    assert.equal(await count(db, 'core.companies', PLACEHOLDER), 1);
  });

  describe('015_crm_catalog_bootstrap_verify.sql', () => {
    test('falla con catálogos vacíos', async () => {
      const db = await fresh();
      await assert.rejects(applyMigration(db, '015_crm_catalog_bootstrap_verify.sql'), /FALLO: faltan 14 fuentes/);
    });

    test('pasa tras la migración y no escribe nada', async () => {
      const db = await fresh();
      await applyBootstrap(db);
      await insertAdmin(db, 'admin-verify@example.invalid');
      const beforeRun = await Promise.all(CATALOG_TABLES.map((table) => snapshot(db, table)));

      await applyMigration(db, '015_crm_catalog_bootstrap_verify.sql');

      assert.deepEqual(await Promise.all(CATALOG_TABLES.map((table) => snapshot(db, table))), beforeRun);
    });

    test('exige un administrador activo', async () => {
      const db = await fresh();
      await applyBootstrap(db);
      await assert.rejects(applyMigration(db, '015_crm_catalog_bootstrap_verify.sql'), /ningún usuario activo con rol Administrador/);
    });
  });
});
