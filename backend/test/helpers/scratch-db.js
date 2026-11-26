/**
 * Bases de datos desechables para las pruebas.
 *
 * Reglas de seguridad:
 *   - Solo se conecta a un PostgreSQL local (localhost). Cualquier otro host
 *     hace que las pruebas de base de datos se omitan: nunca tocan un servidor remoto.
 *   - Del servidor toma solo host, puerto y credenciales. Nunca abre la base
 *     configurada en DATABASE_URL: crea bases propias `capital_test_*` y las elimina.
 *
 * Usa TEST_DATABASE_URL si está definida; si no, las credenciales de backend/.env.
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const BACKEND_DIR = path.resolve(__dirname, '..', '..');
const REPO_DIR = path.resolve(BACKEND_DIR, '..');
const MIGRATIONS_DIR = path.join(REPO_DIR, 'database', 'migrations');
const SCRATCH_PREFIX = 'capital_test_';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

let counter = 0;

function serverUrl() {
  let raw = process.env.TEST_DATABASE_URL;
  if (!raw) {
    const envFile = path.join(BACKEND_DIR, '.env');
    if (!fs.existsSync(envFile)) return null;
    const match = fs.readFileSync(envFile, 'utf8').match(/^DATABASE_URL\s*=\s*(.*)$/m);
    raw = match?.[1].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  if (!raw) return null;
  const url = new URL(raw);
  if (!LOCAL_HOSTS.has(url.hostname)) return null;
  url.search = '';
  return url;
}

const skipDatabaseTests = serverUrl() ? false : 'Sin PostgreSQL local configurado (TEST_DATABASE_URL o backend/.env)';

function urlFor(database) {
  const url = serverUrl();
  if (!url) throw new Error('No hay un PostgreSQL local configurado.');
  url.pathname = `/${database}`;
  return url.href;
}

async function withConnection(database, work) {
  const client = new Client({ connectionString: urlFor(database) });
  await client.connect();
  try {
    return await work(client);
  } finally {
    await client.end();
  }
}

function assertScratchName(name) {
  if (!/^capital_test_[a-z0-9_]+$/.test(name)) throw new Error(`Nombre de base no permitido: ${name}`);
}

async function dropDatabase(name) {
  assertScratchName(name);
  await withConnection('postgres', async (client) => {
    await client.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()', [name]);
    await client.query(`DROP DATABASE IF EXISTS "${name}"`);
  });
}

/**
 * Cada `query` abre su propia conexión: como en psql, un error dentro de
 * BEGIN...COMMIT deshace la transacción al cerrarse la sesión.
 */
function handle(name) {
  return {
    name,
    url: urlFor(name),
    query: (sql, params) => withConnection(name, (client) => client.query(sql, params)),
    rows: async (sql, params) => (await withConnection(name, (client) => client.query(sql, params))).rows,
    drop: () => dropDatabase(name),
  };
}

async function createDatabase(label, template = 'template0') {
  counter += 1;
  const name = `${SCRATCH_PREFIX}${label}_${process.pid}_${counter}`;
  assertScratchName(name);
  await withConnection('postgres', (client) => client.query(`CREATE DATABASE "${name}" TEMPLATE "${template}" ENCODING 'UTF8'`));
  return handle(name);
}

/**
 * Base con el esquema de producción (`database-production-pg10.sql`, solo DDL) y
 * los catálogos vacíos: el estado exacto del incidente que motivó la migración 015.
 */
async function createProductionSchemaDatabase(label) {
  const db = await createDatabase(label);
  const schema = fs.readFileSync(path.join(BACKEND_DIR, 'database-production-pg10.sql'), 'utf8').replace(/^﻿/, '');
  await db.query(schema);
  return db;
}

const readMigration = (file) => fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
const applyMigration = (db, file) => db.query(readMigration(file));
const applyBootstrap = (db) => applyMigration(db, '015_crm_catalog_bootstrap.sql');

/** Rol y usuario administrador mínimos, sin pasar por el seed. */
async function insertAdmin(db, email) {
  await db.query(
    `WITH role AS (
       INSERT INTO security.roles (name, description, is_system, is_active)
       VALUES ('Administrador', 'Acceso total', true, true)
       ON CONFLICT (name) DO UPDATE SET is_active = true
       RETURNING id
     )
     INSERT INTO security.users (role_id, first_name, last_name, email, password_hash, status)
     SELECT id, 'Admin', 'Pruebas', $1, 'hash-de-prueba', 'ACTIVE' FROM role`,
    [email],
  );
}

/** Foto exacta de una tabla para comprobar que no cambió ninguna fila. */
const snapshot = async (db, table) =>
  JSON.stringify(await db.rows(`SELECT row_to_json(t) AS row FROM ${table} t ORDER BY t.id`));

const count = async (db, table, where = 'true') =>
  Number((await db.rows(`SELECT count(*) AS total FROM ${table} WHERE ${where}`))[0].total);

module.exports = {
  BACKEND_DIR,
  REPO_DIR,
  skipDatabaseTests,
  createDatabase,
  createProductionSchemaDatabase,
  readMigration,
  applyMigration,
  applyBootstrap,
  insertAdmin,
  snapshot,
  count,
};
