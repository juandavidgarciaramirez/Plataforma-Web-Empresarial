import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompaniesService } from '../modules/crm/companies/companies.service';
import { ContactsService } from '../modules/crm/contacts/contacts.service';
import { LeadsService } from '../modules/crm/leads/leads.service';
import { OpportunitiesService } from '../modules/crm/opportunities/opportunities.service';
import { UsersService } from '../modules/users/users.service';

/** Actor de auditoría para los datos de demostración (nunca un usuario real). */
const DEMO_ACTOR = 'demo-seed@capitalconsulting.com';
/** Sufijo visible que marca cualquier registro como dato de demostración (sección 50 del brief). */
const DEMO_SUFFIX = ' (Demo)';

/**
 * SUPERADO (Etapa 4, 2026-08-26): Companies/Contacts/Leads/Opportunities ya
 * están conectados a `jud_platform_dev` real — sembrar estos datos "(Demo)"
 * ahora insertaría filas falsas en la base de producción (regla 65 del
 * encargo). Ya NO se registra en `SeedModule`; se conserva el archivo solo
 * como referencia del shape de datos que se usaba en memoria.
 *
 * Datos DEMO / DEVELOPMENT del CRM (sección 50 del brief): 3 empresas,
 * 5 contactos, 8 leads y 4 oportunidades — solo para que el CRM no se vea
 * vacío en desarrollo. Se ejecutaba una sola vez (se saltaba si ya había
 * empresas en el repositorio en memoria) y NUNCA tocaba PostgreSQL. Cada
 * registro quedaba marcado con el sufijo "(Demo)" en su nombre/título para
 * poder identificarlo y borrarlo sin ambigüedad.
 */
@Injectable()
export class CrmSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger('CrmSeed');

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly contactsService: ContactsService,
    private readonly leadsService: LeadsService,
    private readonly opportunitiesService: OpportunitiesService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // Doble seguro por si alguien vuelve a registrar este servicio: nunca corre en
    // producción y en cualquier otro entorno exige activarlo de forma explícita.
    if (process.env.NODE_ENV === 'production' || process.env.CRM_DEMO_SEED !== 'true') {
      this.logger.warn('Seed de datos demo omitido (producción o CRM_DEMO_SEED distinto de "true").');
      return;
    }

    const existing = await this.companiesService.count();
    if (existing > 0) {
      this.logger.log('Ya existen empresas en el CRM, se omite el seed de datos demo.');
      return;
    }

    const seedAdminEmail = this.configService.get<string>('seedAdmin.email')!;
    const admin = await this.usersService.findEntityByEmail(seedAdminEmail);
    const ownerUserId = admin?.id;

    const [transportes, manufacturas, digitales] = await Promise.all([
      this.companiesService.create(
        {
          name: `Transportes del Norte S.A.S.${DEMO_SUFFIX}`,
          taxId: '900123456-7',
          industry: 'Transporte y logística',
          sizeSegment: 'MEDIUM',
          phone: '3011234567',
          ownerUserId,
        },
        DEMO_ACTOR,
      ),
      this.companiesService.create(
        {
          name: `Manufacturas Andina Ltda.${DEMO_SUFFIX}`,
          taxId: '900234567-1',
          industry: 'Manufactura',
          sizeSegment: 'LARGE',
          phone: '3022345678',
        },
        DEMO_ACTOR,
      ),
      this.companiesService.create(
        {
          name: `Soluciones Digitales Bogotá S.A.S.${DEMO_SUFFIX}`,
          taxId: '900345678-2',
          industry: 'Tecnología',
          sizeSegment: 'SMALL',
          phone: '3033456789',
        },
        DEMO_ACTOR,
      ),
    ]);

    const [laura, carlos, marcela, andres] = await Promise.all([
      this.contactsService.create(
        { name: 'Laura Gómez', email: 'laura.gomez@transportesnorte.demo', position: 'Gerente de Operaciones', companyId: transportes.id, ownerUserId },
        DEMO_ACTOR,
      ),
      this.contactsService.create(
        { name: 'Carlos Ramírez', email: 'carlos.ramirez@transportesnorte.demo', position: 'Director HSE', companyId: transportes.id },
        DEMO_ACTOR,
      ),
      this.contactsService.create(
        { name: 'Marcela Rojas', email: 'marcela.rojas@manufacturasandina.demo', position: 'Jefe de Talento Humano', companyId: manufacturas.id },
        DEMO_ACTOR,
      ),
      this.contactsService.create(
        { name: 'Andrés Torres', email: 'andres.torres@solucionesdigitales.demo', position: 'Gerente General', companyId: digitales.id },
        DEMO_ACTOR,
      ),
    ]);
    await this.contactsService.create(
      { name: 'Diana Pérez', email: 'diana.perez@manufacturasandina.demo', position: 'Coordinadora de Compras', companyId: manufacturas.id },
      DEMO_ACTOR,
    );

    await Promise.all([
      this.leadsService.create(
        { name: `Jorge Salazar${DEMO_SUFFIX}`, email: 'jorge.salazar@demo.co', source: 'MANUAL', serviceInterest: 'capital-hse', status: 'NEW' },
        DEMO_ACTOR,
      ),
      this.leadsService.create(
        { name: `Patricia Duarte${DEMO_SUFFIX}`, email: 'patricia.duarte@demo.co', source: 'WEBSITE_FORM', serviceInterest: 'capital-staffing', status: 'CONTACTED' },
        DEMO_ACTOR,
      ),
      this.leadsService.create(
        { name: `Fernando Castro${DEMO_SUFFIX}`, companyName: 'Andina Foods S.A.S.', source: 'YURI', serviceInterest: 'capital-hse', status: 'NEW' },
        DEMO_ACTOR,
      ),
      this.leadsService.create(
        {
          name: `Camila Vargas${DEMO_SUFFIX}`,
          email: 'camila.vargas@demo.co',
          source: 'REFERRAL',
          serviceInterest: 'capital-mobility',
          status: 'QUALIFIED',
          ownerUserId,
        },
        DEMO_ACTOR,
      ),
      this.leadsService.create(
        { name: `Ricardo Gómez${DEMO_SUFFIX}`, email: 'ricardo.gomez@demo.co', source: 'PQR', serviceInterest: 'capital-hse', status: 'NEW' },
        DEMO_ACTOR,
      ),
      this.leadsService.create(
        { name: `Natalia Restrepo${DEMO_SUFFIX}`, source: 'CHAT', serviceInterest: 'capital-learning', status: 'CONTACTED' },
        DEMO_ACTOR,
      ),
      this.leadsService.create(
        { name: `Simón Herrera${DEMO_SUFFIX}`, source: 'MANUAL', serviceInterest: 'capital-staffing', status: 'DISQUALIFIED' },
        DEMO_ACTOR,
      ),
      this.leadsService.create(
        {
          name: `Valentina Cruz${DEMO_SUFFIX}`,
          email: 'valentina.cruz@demo.co',
          source: 'WEBSITE_FORM',
          serviceInterest: 'capital-business-services',
          status: 'QUALIFIED',
        },
        DEMO_ACTOR,
      ),
    ]);

    await this.opportunitiesService.create(
      {
        title: `Implementación Capital HSE — Transportes del Norte${DEMO_SUFFIX}`,
        companyId: transportes.id,
        contactId: carlos.id,
        value: 45_000_000,
        stage: 'PROPOSAL',
        probability: 60,
        ownerUserId,
      },
      DEMO_ACTOR,
    );
    await this.opportunitiesService.create(
      {
        title: `Formación Capital Learning — Manufacturas Andina${DEMO_SUFFIX}`,
        companyId: manufacturas.id,
        contactId: marcela.id,
        value: 28_000_000,
        stage: 'NEGOTIATION',
        probability: 75,
      },
      DEMO_ACTOR,
    );

    const ganada = await this.opportunitiesService.create(
      {
        title: `Staffing Capital Talento Humano — Soluciones Digitales${DEMO_SUFFIX}`,
        companyId: digitales.id,
        contactId: andres.id,
        value: 15_000_000,
        probability: 90,
        ownerUserId,
      },
      DEMO_ACTOR,
    );
    await this.opportunitiesService.close(ganada.id, { outcome: 'WON' }, DEMO_ACTOR);

    const perdida = await this.opportunitiesService.create(
      {
        title: `Consultoría Capital Business Services — Transportes del Norte${DEMO_SUFFIX}`,
        companyId: transportes.id,
        contactId: laura.id,
        value: 20_000_000,
        probability: 30,
      },
      DEMO_ACTOR,
    );
    await this.opportunitiesService.close(
      perdida.id,
      { outcome: 'LOST', reason: 'Presupuesto asignado a otro proveedor' },
      DEMO_ACTOR,
    );

    this.logger.log('Datos demo del CRM creados: 3 empresas, 5 contactos, 8 leads, 4 oportunidades.');
  }
}
