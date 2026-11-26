/**
 * Pruebas sin base de datos: que el catálogo, la migración 015, el código y el
 * verificador digan lo mismo, y que nada pueda sembrar datos de demostración.
 */
const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
require('reflect-metadata');

const { BACKEND_DIR, readMigration } = require('./helpers/scratch-db');
const catalog = require('../src/modules/crm/common/crm-catalog.json');

const dist = (file) => require(path.join(BACKEND_DIR, 'dist', file));
const stripComments = (sql) => sql.replace(/--.*$/gm, '');

const migration = readMigration('015_crm_catalog_bootstrap.sql');
const verify = readMigration('015_crm_catalog_bootstrap_verify.sql');
const platformMigration = readMigration('016_platform_catalog_bootstrap.sql');
const platformVerify = readMigration('016_platform_catalog_bootstrap_verify.sql');

describe('catálogo, migración y código coinciden', () => {
  test('la migración y su verificación contienen todas las fuentes y estados', () => {
    for (const name of [...catalog.leadSources, ...catalog.leadStatuses]) {
      assert.ok(migration.includes(`'${name}'`), `falta "${name}" en la migración`);
      assert.ok(verify.includes(`'${name}'`), `falta "${name}" en la verificación`);
    }
    assert.equal(catalog.leadSources.length, 14);
    assert.equal(catalog.leadStatuses.length, 10);
  });

  test('las etapas de la migración tienen el orden y los indicadores del catálogo', () => {
    assert.equal(catalog.pipeline.stages.length, 5);
    for (const stage of catalog.pipeline.stages) {
      const row = new RegExp(`\\('${stage.name}',\\s*'[^']*',\\s*${stage.order},\\s*[\\d.]+,\\s*'[^']*',\\s*${stage.isClosed},\\s*${stage.isSuccess}\\)`);
      assert.match(migration, row, `etapa "${stage.name}" distinta del catálogo`);
    }
  });

  test('el pipeline y la empresa placeholder coinciden', () => {
    assert.ok(migration.includes(`'${catalog.pipeline.name}'`));
    assert.ok(migration.includes(`'${catalog.noCompanyPlaceholder.legalName}'`));
    assert.ok(migration.includes(`'${catalog.noCompanyPlaceholder.commercialName}'`));
    assert.ok(migration.includes(`'${catalog.defaultCountryIso2}'`));
  });

  test('cada valor de la aplicación apunta a un registro del catálogo', () => {
    const { LEAD_SOURCES, LEAD_STATUSES } = dist('modules/crm/leads/entities/lead.entity.js');
    assert.deepEqual(Object.keys(catalog.appSources).sort(), [...LEAD_SOURCES].sort());
    assert.deepEqual(Object.keys(catalog.appStatuses).sort(), [...LEAD_STATUSES].sort());

    const stageNames = catalog.pipeline.stages.map((stage) => stage.name);
    for (const name of Object.values(catalog.appSources)) assert.ok(catalog.leadSources.includes(name), name);
    for (const { status, stage } of Object.values(catalog.appStatuses)) {
      assert.ok(catalog.leadStatuses.includes(status), status);
      assert.ok(stageNames.includes(stage), stage);
    }
    for (const name of catalog.leadStatuses) {
      assert.ok(LEAD_STATUSES.includes(catalog.statusToApp[name]), `estado sin correspondencia: ${name}`);
    }
  });

  test('los códigos que usa PQR coinciden con el catálogo y con la migración 016', () => {
    const { PQR_TYPES } = dist('modules/pqr/entities/pqr.entity.js');
    assert.deepEqual([...catalog.platformCatalog.pqrTypes].sort(), [...PQR_TYPES].sort());

    const source = fs.readFileSync(path.join(BACKEND_DIR, 'src/modules/pqr/repositories/prisma-pqr.repository.ts'), 'utf8');
    const block = source.match(/APP_TO_DB_STATUS[^{]*\{([\s\S]*?)\};/)[1];
    const statuses = [...block.matchAll(/:\s*'([A-Z_]+)'/g)].map((match) => match[1]);
    assert.deepEqual([...catalog.platformCatalog.pqrStatuses].sort(), statuses.sort());
    assert.deepEqual(catalog.platformCatalog.pqrPriorities, [source.match(/DEFAULT_PRIORITY_CODE = '([A-Z_]+)'/)[1]]);

    const { pqrTypes, pqrStatuses, pqrPriorities } = catalog.platformCatalog;
    for (const code of [...pqrTypes, ...pqrStatuses, ...pqrPriorities, ...catalog.yuri.intentCodes]) {
      assert.ok(platformMigration.includes(`'${code}'`), `falta "${code}" en la 016`);
      assert.ok(platformVerify.includes(`'${code}'`), `falta "${code}" en la verificación de la 016`);
    }
  });

  test('las dependencias de Yuri coinciden con su código', () => {
    const { CHAT_SERVICES } = dist('modules/chat/chat.constants.js');
    assert.deepEqual([...catalog.yuri.serviceCodes].sort(), CHAT_SERVICES.map((service) => service.id).sort());

    const source = fs.readFileSync(path.join(BACKEND_DIR, 'src/modules/chat/repositories/prisma-chat.repository.ts'), 'utf8');
    const block = source.match(/INTENT_CODE_MAP[^{]*\{([\s\S]*?)\};/)[1];
    const codes = [...block.matchAll(/:\s*'([A-Z_]+)'/g)].map((match) => match[1]);
    assert.deepEqual([...catalog.yuri.intentCodes].sort(), codes.sort());
  });
});

const MIGRATIONS = [
  ['015', migration, verify],
  ['016', platformMigration, platformVerify],
];

for (const [number, sql, verifySql] of MIGRATIONS) {
  describe(`la migración ${number} es segura y compatible con PostgreSQL 10`, () => {
    const code = stripComments(sql);
    const verifyCode = stripComments(verifySql);

    test('solo inserta: sin DDL, UPDATE, DELETE ni TRUNCATE', () => {
      assert.doesNotMatch(code, /\b(DROP|TRUNCATE|DELETE|ALTER|UPDATE|CREATE)\b/i);
    });

    test('es una sola transacción, con líneas BEGIN y COMMIT que el ensayo puede reemplazar', () => {
      assert.equal(code.match(/^BEGIN;\r?$/gm)?.length, 1);
      assert.equal(code.match(/^COMMIT;\r?$/gm)?.length, 1);
    });

    test('fija la codificación antes de cualquier texto con acentos', () => {
      for (const text of [code, verifyCode]) {
        const encoding = text.indexOf("SET LOCAL client_encoding = 'UTF8';");
        assert.ok(encoding > 0);
        assert.doesNotMatch(text.slice(0, encoding), /[^\x00-\x7F]/);
      }
    });

    test('no usa funciones de versiones posteriores a PostgreSQL 10', () => {
      const newerThan10 = [
        /\bCREATE\s+(OR\s+REPLACE\s+)?PROCEDURE\b/i,
        /\bCALL\s+\w/i,
        /GENERATED\s+ALWAYS\s+AS\s*\(/i,
        /\bINCLUDE\s*\(/i,
        /\bMERGE\s+INTO\b/i,
        /\bNULLS\s+NOT\s+DISTINCT\b/i,
        /date_trunc\s*\([^)]*,[^)]*,/i,
        /\bWITH\s*\(\s*FORCE\s*\)/i,
      ];
      for (const text of [code, verifyCode]) {
        for (const pattern of newerThan10) assert.doesNotMatch(text, pattern);
      }
    });

    test('la verificación es de solo lectura', () => {
      assert.match(verifyCode, /^BEGIN TRANSACTION READ ONLY;\r?$/m);
      assert.match(verifyCode, /^ROLLBACK;\r?$/m);
      assert.doesNotMatch(verifyCode, /\b(INSERT|UPDATE|DELETE|TRUNCATE|DROP|ALTER|CREATE)\b/i);
    });
  });
}

describe('separación de seeds', () => {
  test('el módulo de seed registra solo el seed de seguridad', () => {
    const { SeedModule } = dist('database/seed.module.js');
    const { SeedService } = dist('database/seed.service.js');
    assert.deepEqual(Reflect.getMetadata('providers', SeedModule), [SeedService]);
  });

  test('CrmSeedService no siembra en producción ni sin activación explícita', async () => {
    const { CrmSeedService } = dist('database/crm-seed.service.js');
    let touched = false;
    const spy = new Proxy({}, { get: () => () => { touched = true; return 0; } });
    const service = new CrmSeedService(spy, spy, spy, spy, spy, spy);
    const saved = { NODE_ENV: process.env.NODE_ENV, CRM_DEMO_SEED: process.env.CRM_DEMO_SEED };
    try {
      process.env.NODE_ENV = 'production';
      process.env.CRM_DEMO_SEED = 'true';
      await service.onApplicationBootstrap();
      process.env.NODE_ENV = 'development';
      delete process.env.CRM_DEMO_SEED;
      await service.onApplicationBootstrap();
    } finally {
      for (const [key, value] of Object.entries(saved)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
    assert.equal(touched, false);
  });

  test('el nombre de la empresa propia solo está en el catálogo', () => {
    assert.ok(catalog.ownCompany.legalName.trim().length > 0);
    const source = fs.readFileSync(path.join(BACKEND_DIR, 'src/modules/files/repositories/prisma-file.repository.ts'), 'utf8');
    assert.ok(!source.includes(`'${catalog.ownCompany.legalName}'`));
  });

  test('la configuración no trae credenciales de administrador por defecto', () => {
    for (const file of ['src/config/configuration.ts', 'src/config/env.validation.ts', 'src/modules/crm/common/crm-db.util.ts']) {
      const source = fs.readFileSync(path.join(BACKEND_DIR, file), 'utf8');
      assert.doesNotMatch(source, /Admin123|admin@capitalconsulting/, file);
    }
  });
});

describe('reglas de Yuri para contactos sin empresa', () => {
  const { isNoCompanyAnswer, declaredCompany } = dist('modules/chat/chat.rules.js');
  const { NO_COMPANY_ANSWER } = dist('modules/chat/chat.constants.js');

  for (const answer of ['No tengo empresa', 'ninguna', 'Soy independiente', 'independiente.', 'persona natural', 'Sin empresa', 'no aplica', 'N/A', 'No represento a ninguna']) {
    test(`"${answer}" significa que no hay empresa`, () => assert.equal(isNoCompanyAnswer(answer), true));
  }
  for (const answer of ['Andina SAS', 'Independiente Medellín SAS', 'Transportes Sin Fronteras', 'Nacional de Seguros']) {
    test(`"${answer}" es el nombre de una empresa`, () => assert.equal(isNoCompanyAnswer(answer), false));
  }

  test('la marca interna nunca se trata como empresa', () => {
    assert.equal(declaredCompany(NO_COMPANY_ANSWER), null);
    assert.equal(declaredCompany(null), null);
    assert.equal(declaredCompany('Andina SAS'), 'Andina SAS');
  });
});

describe('errores seguros para los registros', () => {
  const { CrmSetupError } = dist('modules/crm/common/crm-db.util.js');
  const { SafeLogError, safeErrorSummary } = dist('common/utils/safe-error.util.js');

  test('un error genérico no filtra su mensaje', () => {
    const summary = safeErrorSummary(new Error('fallo con carlos@andina.co y 3001234567'));
    assert.doesNotMatch(summary, /carlos|3001234567/);
  });

  test('un error de Prisma conserva código y columna, pero no los valores', () => {
    const error = Object.assign(new Error('Invalid invocation: { email: "carlos@andina.co" }'), {
      name: 'PrismaClientKnownRequestError',
      code: 'P2000',
      meta: { target: 'interested_service' },
    });
    const summary = safeErrorSummary(error);
    assert.match(summary, /P2000/);
    assert.match(summary, /interested_service/);
    assert.doesNotMatch(summary, /carlos/);
  });

  test('un error redactado conserva su mensaje', () => {
    assert.match(safeErrorSummary(new SafeLogError('No se pudo actualizar el lead 7')), /lead 7/);
  });

  test('un error de instalación conserva la indicación de cómo resolverlo', () => {
    assert.match(safeErrorSummary(new CrmSetupError('Falta X', 'ejecutar Y')), /Falta X: ejecutar Y/);
  });
});
