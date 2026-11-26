/**
 * Flujo completo de Yuri con los servicios y repositorios reales sobre una base
 * desechable: ChatService -> LeadsService -> PrismaLeadRepository -> PostgreSQL.
 * Nunca se conecta a producción: `assertScratchConnection` lo comprueba antes de escribir.
 */
const { after, before, beforeEach, describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('crypto');
const path = require('path');
require('reflect-metadata');
const {
  BACKEND_DIR,
  applyBootstrap,
  applyMigration,
  count,
  createProductionSchemaDatabase,
  insertAdmin,
  skipDatabaseTests,
} = require('./helpers/scratch-db');

const ADMIN_EMAIL = 'qa-yuri-admin@example.invalid';
const dist = (file) => require(path.join(BACKEND_DIR, 'dist', file));

describe('flujo de Yuri', { skip: skipDatabaseTests }, () => {
  let db;
  let prisma;
  let leads;
  let chat;
  let loggedErrors;

  /** Devuelve las filas de CRM con sus catálogos resueltos. */
  const leadRows = (sessionId) =>
    db.rows(
      `SELECT l.id, l.title, l.campaign, l.company_id, l.interested_service, l.assigned_to, l.created_by,
              so.name AS source, st.name AS status, p.name AS pipeline, ps.name AS stage, ps.pipeline_id AS stage_pipeline,
              l.pipeline_id, co.legal_name AS company, c.id AS contact_id, c.email AS contact_email, c.phone AS contact_phone,
              c.company_id AS contact_company_id, cc.legal_name AS contact_company
         FROM crm.leads l
         JOIN crm.lead_sources so ON so.id = l.source_id
         JOIN crm.lead_statuses st ON st.id = l.status_id
         JOIN crm.pipelines p ON p.id = l.pipeline_id
         JOIN crm.pipeline_stages ps ON ps.id = l.stage_id
         JOIN core.contacts c ON c.id = l.contact_id
         JOIN core.companies cc ON cc.id = c.company_id
         LEFT JOIN core.companies co ON co.id = l.company_id
        WHERE l.campaign = $1 ORDER BY l.id`,
      [sessionId],
    );

  const adminId = async () => (await db.rows('SELECT id FROM security.users WHERE email = $1', [ADMIN_EMAIL]))[0].id;
  const send = (sessionId, message) => chat.handleMessage({ sessionId, message });
  const uniqueEmail = () => `visitante-${randomUUID().slice(0, 8)}@andina.co`;

  /** Conversación completa de cotización; devuelve la última respuesta de Yuri. */
  const quoteConversation = async (sessionId, { company = 'Andina SAS', email = uniqueEmail(), phone = '3001234567' } = {}) => {
    await send(sessionId, 'Quiero una cotización de Capital HSE');
    await send(sessionId, 'Carlos Pérez');
    await send(sessionId, company);
    await send(sessionId, email);
    return send(sessionId, phone);
  };

  before(async () => {
    db = await createProductionSchemaDatabase('yuri');
    process.env.DATABASE_URL = db.url;
    process.env.SEED_ADMIN_EMAIL = ADMIN_EMAIL;

    const { PrismaService } = dist('database/prisma/prisma.service.js');
    const { PrismaLeadRepository } = dist('modules/crm/leads/repositories/prisma-lead.repository.js');
    const { PrismaChatRepository } = dist('modules/chat/repositories/prisma-chat.repository.js');
    const { LeadsService } = dist('modules/crm/leads/leads.service.js');
    const { ChatService } = dist('modules/chat/chat.service.js');

    prisma = new PrismaService();
    const [{ current_database: connected }] = await prisma.$queryRaw`SELECT current_database()`;
    assert.equal(connected, db.name, 'las pruebas deben escribir solo en la base desechable');

    const noop = { log() {}, notifyByPermission: async () => {} };
    leads = new LeadsService(new PrismaLeadRepository(prisma), {}, noop, noop);
    chat = new ChatService(new PrismaChatRepository(prisma), leads);

    // Como en el incidente de producción: país, servicios y administrador ya existían; solo faltaban los catálogos del CRM.
    await db.query(`INSERT INTO core.countries (iso2, iso3, name) VALUES ('CO', 'COL', 'Colombia')`);
    await applyMigration(db, '013_seed_catalog_services.sql');
    await insertAdmin(db, ADMIN_EMAIL);
  });

  beforeEach(() => {
    loggedErrors = [];
    chat.logger = { error: (message) => loggedErrors.push(message), log() {}, warn() {} };
  });

  after(async () => {
    await prisma?.$disconnect();
    await db?.drop();
  });

  // Va primero: reproduce el incidente real, con los catálogos todavía vacíos.
  describe('con catálogos vacíos (incidente original)', () => {
    let sessionId;
    let reply;

    test('Yuri no afirma haber registrado la solicitud', async () => {
      sessionId = randomUUID();
      reply = await quoteConversation(sessionId, { email: 'carlos-incidente@andina.co' });

      assert.doesNotMatch(reply.message, /Registré/);
      assert.match(reply.message, /no pude registrar la solicitud/);
      assert.equal(reply.leadIntent, false);
      assert.ok(reply.channels?.whatsapp, 'ofrece un canal alternativo');
    });

    test('no deja leads, contactos ni empresas huérfanos', async () => {
      assert.equal(await count(db, 'crm.leads'), 0);
      assert.equal(await count(db, 'core.contacts'), 0);
      assert.equal(await count(db, 'core.companies'), 0);
    });

    test('el registro indica la causa y la solución, sin datos personales', async () => {
      const failing = randomUUID();
      await quoteConversation(failing, { email: 'carlos-log@andina.co' });
      assert.ok(loggedErrors.length > 0);
      const log = loggedErrors.join('\n');
      assert.match(log, /crm\.lead_sources/);
      assert.match(log, /015_crm_catalog_bootstrap\.sql/);
      assert.doesNotMatch(log, /carlos-log@andina\.co|3001234567|Carlos/);
    });

    test('tras aplicar la 015, reintentar en la misma sesión registra el lead', async () => {
      await applyBootstrap(db);

      const retry = await send(sessionId, 'Solicitar cotización');

      assert.match(retry.message, /Registré tu solicitud/);
      assert.equal(retry.leadIntent, true);
      const rows = await leadRows(sessionId);
      assert.equal(rows.length, 1);
      assert.equal(rows[0].contact_email, 'carlos-incidente@andina.co');
    });
  });

  describe('con el catálogo completo', () => {
    test('un lead nuevo queda con fuente, estado, etapa, pipeline, administrador y servicio correctos', async () => {
      const sessionId = randomUUID();
      const email = uniqueEmail();

      const reply = await quoteConversation(sessionId, { company: 'Transportes del Sur SAS', email });

      assert.match(reply.message, /Registré tu solicitud de cotización de .* para Transportes del Sur SAS/);
      assert.equal(reply.leadIntent, true);

      const rows = await leadRows(sessionId);
      assert.equal(rows.length, 1);
      const [lead] = rows;
      assert.equal(lead.source, 'Yuri (Chatbot)');
      assert.equal(lead.status, 'Nuevo');
      assert.equal(lead.stage, 'Nuevo');
      assert.equal(lead.pipeline, 'Ventas');
      assert.equal(lead.stage_pipeline, lead.pipeline_id, 'la etapa pertenece al pipeline del lead');
      assert.equal(lead.assigned_to, await adminId());
      assert.equal(lead.created_by, await adminId());
      assert.equal(lead.interested_service, 'capital-hse');
      assert.equal(lead.campaign, sessionId);
      assert.equal(lead.title, 'Carlos Pérez');
      assert.equal(lead.company, 'Transportes del Sur SAS');
      assert.equal(lead.contact_company, 'Transportes del Sur SAS');
      assert.equal(lead.contact_email, email);
      assert.equal(lead.contact_phone, '3001234567');

      const [session] = await db.rows('SELECT lead_id FROM chat.chat_sessions WHERE id = $1', [sessionId]);
      assert.equal(session.lead_id, lead.id, 'la sesión de chat queda enlazada con el lead');
    });

    test('repetir la misma sesión no crea un segundo lead, contacto ni empresa', async () => {
      const sessionId = randomUUID();
      await quoteConversation(sessionId, { company: 'Repetida SAS' });
      const contactsBefore = await count(db, 'core.contacts');
      const companiesBefore = await count(db, 'core.companies');

      const again = await send(sessionId, 'Solicitar cotización');
      await send(sessionId, 'Solicitar cotización');

      assert.match(again.message, /Registré tu solicitud/);
      assert.equal((await leadRows(sessionId)).length, 1);
      assert.equal(await count(db, 'core.contacts'), contactsBefore);
      assert.equal(await count(db, 'core.companies'), companiesBefore);
    });

    test('peticiones simultáneas de una misma sesión generan un solo lead', async () => {
      const sessionId = randomUUID();
      const email = uniqueEmail();
      const input = { chatSessionId: sessionId, name: 'Ana Ruiz', company: null, email, phone: '3101234567', service: 'capital-mobility', need: null };

      await Promise.all(Array.from({ length: 6 }, () => leads.upsertFromChat(input)));

      assert.equal((await leadRows(sessionId)).length, 1);
      assert.equal(await count(db, 'core.contacts', `email = '${email}'`), 1);
    });

    for (const answer of ['No tengo empresa', 'Soy independiente', 'persona natural']) {
      test(`un contacto sin empresa ("${answer}") usa la empresa técnica y no crea una empresa`, async () => {
        const sessionId = randomUUID();
        const companiesBefore = await count(db, 'core.companies');

        const reply = await quoteConversation(sessionId, { company: answer });

        assert.match(reply.message, /Listo, Carlos Pérez\. Registré tu solicitud/, 'conserva el nombre del visitante');
        assert.doesNotMatch(reply.message, /Sin empresa/);
        assert.equal(await count(db, 'core.companies'), companiesBefore);

        const [lead] = await leadRows(sessionId);
        assert.equal(lead.company_id, null);
        assert.equal(lead.company, null);
        assert.equal(lead.contact_company, 'Contactos Independientes (Sin Empresa)');
      });
    }

    test('el mensaje de WhatsApp no presenta la marca interna como empresa', async () => {
      const reply = await quoteConversation(randomUUID(), { company: 'ninguna' });
      assert.doesNotMatch(decodeURIComponent(reply.channels.whatsapp.url), /de Sin empresa/);
    });

    test('con empresa informada se reutiliza si ya existe (sin distinguir mayúsculas)', async () => {
      const first = randomUUID();
      const second = randomUUID();
      await quoteConversation(first, { company: 'Compartida SAS' });
      const companiesBefore = await count(db, 'core.companies');

      await quoteConversation(second, { company: 'COMPARTIDA SAS' });

      assert.equal(await count(db, 'core.companies'), companiesBefore);
      assert.equal((await leadRows(second))[0].company, 'Compartida SAS');
    });

    test('un mismo correo en otra sesión reutiliza el contacto y crea otro lead', async () => {
      const email = uniqueEmail();
      const first = randomUUID();
      const second = randomUUID();
      await quoteConversation(first, { email });
      await quoteConversation(second, { email: email.toUpperCase().replace('@ANDINA.CO', '@andina.co') });

      const [a] = await leadRows(first);
      const [b] = await leadRows(second);
      assert.notEqual(a.id, b.id);
      assert.equal(a.contact_id, b.contact_id);
    });

    test('una sesión con identificador que no es UUID también queda enlazada', async () => {
      const sessionId = `fallback-${randomUUID()}`;
      await quoteConversation(sessionId);
      const [lead] = await leadRows(sessionId);
      assert.ok(lead);
      assert.equal(await count(db, 'chat.chat_sessions', `lead_id = ${lead.id}`), 1);
    });

    test('actualizar el lead de una sesión guarda la empresa nueva', async () => {
      const sessionId = randomUUID();
      const base = { chatSessionId: sessionId, name: 'Ana Ruiz', email: uniqueEmail(), phone: null, service: null, need: null };
      await leads.upsertFromChat({ ...base, company: null });
      assert.equal((await leadRows(sessionId))[0].company, null);

      await leads.upsertFromChat({ ...base, company: 'Nueva Empresa SAS' });

      const rows = await leadRows(sessionId);
      assert.equal(rows.length, 1);
      assert.equal(rows[0].company, 'Nueva Empresa SAS');
    });

    test('un lead eliminado no absorbe una nueva solicitud de la misma sesión', async () => {
      const sessionId = randomUUID();
      const input = { chatSessionId: sessionId, name: 'Ana Ruiz', company: null, email: uniqueEmail(), phone: null, service: null, need: null };
      const created = await leads.upsertFromChat(input);
      await db.query('UPDATE crm.leads SET deleted_at = now() WHERE id = $1', [created.id]);

      const recreated = await leads.upsertFromChat(input);

      assert.notEqual(recreated.id, created.id);
    });
  });

  describe('atomicidad y errores', () => {
    test('si el lead no se puede guardar no quedan empresa ni contacto huérfanos', async () => {
      const email = uniqueEmail();
      const companiesBefore = await count(db, 'core.companies');
      const contactsBefore = await count(db, 'core.contacts');

      // `interested_service` admite 200 caracteres: falla al insertar el lead, después de crear empresa y contacto.
      await assert.rejects(
        leads.upsertFromChat({
          chatSessionId: randomUUID(),
          name: 'Ana Ruiz',
          company: 'Empresa Huérfana SAS',
          email,
          phone: null,
          service: 'x'.repeat(201),
          need: null,
        }),
      );

      assert.equal(await count(db, 'core.companies'), companiesBefore);
      assert.equal(await count(db, 'core.contacts'), contactsBefore);
    });

    test('sin administrador configurado no se registra y no se afirma lo contrario', async () => {
      const sessionId = randomUUID();
      const companiesBefore = await count(db, 'core.companies');
      process.env.SEED_ADMIN_EMAIL = 'no-existe@example.invalid';
      try {
        const reply = await quoteConversation(sessionId, { company: 'Sin Admin SAS' });
        assert.match(reply.message, /no pude registrar la solicitud/);
        assert.doesNotMatch(reply.message, /Registré/);
        assert.equal(reply.leadIntent, false);
      } finally {
        process.env.SEED_ADMIN_EMAIL = ADMIN_EMAIL;
      }
      assert.equal((await leadRows(sessionId)).length, 0);
      assert.equal(await count(db, 'core.companies'), companiesBefore);
      assert.ok(!loggedErrors.join('\n').includes('no-existe@example.invalid'));
    });

    test('si falla la actualización de un lead, los registros dan la causa sin datos personales', async () => {
      const { safeErrorSummary } = dist('common/utils/safe-error.util.js');
      const repository = leads.leadRepository;
      const repositoryLog = [];
      const originalLogger = repository.logger;
      repository.logger = { error: (message) => repositoryLog.push(message) };
      const email = uniqueEmail();
      const input = { chatSessionId: randomUUID(), name: 'Ana Ruiz', company: null, email, phone: null, service: null, need: null };
      try {
        const created = await leads.upsertFromChat(input);

        await assert.rejects(leads.upsertFromChat({ ...input, service: 'x'.repeat(201) }), (error) => {
          const summary = safeErrorSummary(error);
          assert.ok(summary.includes(`No se pudo actualizar el lead ${created.id}`), summary);
          assert.ok(!summary.includes(email));
          return true;
        });

        const log = repositoryLog.join('\n');
        assert.match(log, /P2000/, log);
        assert.ok(!log.includes(email) && !log.includes('Ana Ruiz'), log);
      } finally {
        repository.logger = originalLogger;
      }
    });

    test('el registro de archivos usa la empresa del catálogo y explica si falta', async () => {
      const { PrismaFileRepository } = dist('modules/files/repositories/prisma-file.repository.js');
      const { CrmSetupError, CRM_CATALOG } = dist('modules/crm/common/crm-db.util.js');
      const files = new PrismaFileRepository(prisma);

      await assert.rejects(
        files.create({ originalName: 'a.pdf', fileName: 'a.pdf', storagePath: 'x/a.pdf', sizeBytes: 1, mimeType: 'application/pdf' }),
        (error) => error instanceof CrmSetupError && /ownCompany/.test(error.message),
      );

      const { legalName } = CRM_CATALOG.ownCompany;
      await db.query(`INSERT INTO core.companies (country_id, legal_name) SELECT id, $1 FROM core.countries WHERE iso2 = 'CO'`, [legalName]);
      const [{ id }] = await db.rows('SELECT id FROM core.companies WHERE legal_name = $1', [legalName]);
      assert.equal(String(await files.resolveOwnCompanyId()), id);
    });

    test('sin SEED_ADMIN_EMAIL no hay usuario de reemplazo inventado', async () => {
      const { resolveActorUserId, CrmSetupError } = dist('modules/crm/common/crm-db.util.js');
      delete process.env.SEED_ADMIN_EMAIL;
      try {
        await assert.rejects(resolveActorUserId(prisma, null), (error) => error instanceof CrmSetupError && /SEED_ADMIN_EMAIL no está definido/.test(error.message));
      } finally {
        process.env.SEED_ADMIN_EMAIL = ADMIN_EMAIL;
      }
    });

    test('un administrador eliminado no recibe leads', async () => {
      const email = 'admin-eliminado@example.invalid';
      await insertAdmin(db, email);
      await db.query('UPDATE security.users SET deleted_at = now() WHERE email = $1', [email]);
      process.env.SEED_ADMIN_EMAIL = email;
      try {
        await assert.rejects(
          leads.upsertFromChat({ chatSessionId: randomUUID(), name: 'Ana', company: null, email: uniqueEmail(), phone: null, service: null, need: null }),
          /eliminado/,
        );
      } finally {
        process.env.SEED_ADMIN_EMAIL = ADMIN_EMAIL;
      }
    });
  });
});
