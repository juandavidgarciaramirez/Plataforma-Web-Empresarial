# Plataforma Web Empresarial

Sitio corporativo y panel administrativo de **Capital Consulting and Services SAS**.

- **Sitio público:** servicios, blog, noticias, equipo, trabaja con nosotros, PQR y contacto.
- **Asistente "Yuri":** chat del sitio que registra leads en el CRM.
- **Panel administrativo:** CMS de contenidos e imágenes, CRM (leads, contactos y actividades), PQR, postulaciones, usuarios, roles y permisos, auditoría y analítica web propia.

## Tecnologías

| Capa | Tecnologías |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, TanStack Query |
| Backend | NestJS 10, Prisma 6, JWT, Swagger, Helmet |
| Base de datos | PostgreSQL (producción en PostgreSQL 10) |

## Estructura

```
.
├── src/                 Frontend Next.js
│   ├── app/             Rutas: (public) sitio, (auth) login, (dashboard) panel
│   ├── components/      Componentes (atoms, molecules, organisms, ui, seo)
│   ├── features/        Formularios de careers, contacto y PQR
│   └── services/        Clientes de la API
├── public/              Imágenes, video y archivos estáticos
├── backend/             API NestJS
│   ├── src/modules/     auth, users, roles, permissions, crm, content, media,
│   │                    analytics, pqr, careers, chat, files, notifications…
│   ├── prisma/          schema.prisma (el cliente se genera en prisma/generated)
│   ├── scripts/         verify-deploy.js: verificación de despliegue (solo lectura)
│   └── test/            Pruebas (node --test)
├── database/
│   ├── migrations/      Migraciones SQL numeradas y sus verificadores *_verify.sql
│   ├── seeds/           Datos de referencia (municipios DIVIPOLA)
│   ├── audit/           Consultas de auditoría
│   └── docs/            Bitácora de migraciones y guías de instalación del CRM
├── docs/                Seguridad, SEO, despliegue, imágenes y analítica
└── deploy.sh            Script de despliegue del backend en cPanel
```

## Requisitos

- Node.js 22, la versión que usa el servidor.
- PostgreSQL. Todo el SQL debe ser compatible con PostgreSQL 10.

## Puesta en marcha local

### 1. Base de datos

Las migraciones de `database/migrations/` se aplican a mano, en orden numérico, con `psql`:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/001_foundation.sql
```

Cada migración tiene un `*_verify.sql` para comprobar el resultado. El orden y el estado de cada una están en [database/docs/MIGRATION_LOG.md](database/docs/MIGRATION_LOG.md). Para una instalación nueva, sigue [database/docs/CRM_NEW_INSTALL_CHECKLIST.md](database/docs/CRM_NEW_INSTALL_CHECKLIST.md).

### 2. Backend

```bash
cd backend
cp .env.example .env      # completar DATABASE_URL, secretos JWT y SEED_ADMIN_*
npm install               # también ejecuta prisma generate
npm run start:dev         # http://localhost:3001/api/v1
```

La documentación Swagger queda en `http://localhost:3001/api/docs`.

Para crear el administrador y el catálogo de permisos:

```bash
npm run build
npm run seed:security
```

### 3. Frontend

Desde la raíz del repositorio:

```bash
cp .env.example .env.local    # NEXT_PUBLIC_API_URL apunta al backend local
npm install
npm run dev                   # http://localhost:3000
```

## Pruebas

```bash
cd backend
npm test
```

Las pruebas de base de datos solo se conectan a un PostgreSQL local. Crean bases temporales `capital_test_*` y las eliminan al terminar. Nunca abren la base configurada en `DATABASE_URL`. Si no hay un PostgreSQL local configurado (en `TEST_DATABASE_URL` o en `backend/.env`), esas pruebas se omiten.

## Variables de entorno

Los archivos `.env` no se versionan. Las plantillas son:

- [`.env.example`](.env.example): frontend.
- [`backend/.env.example`](backend/.env.example): backend.

En producción, usa secretos propios para `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` y `SEED_ADMIN_PASSWORD`.

## Documentación

- [docs/security.md](docs/security.md) y [docs/deployment-security.md](docs/deployment-security.md): seguridad.
- [docs/despliegue-etapa-15.md](docs/despliegue-etapa-15.md): procedimiento de despliegue.
- [docs/media-y-analitica.md](docs/media-y-analitica.md): imágenes del CMS y analítica web.
- [docs/seo.md](docs/seo.md): SEO.
- [database/docs/CRM_PRODUCTION_BOOTSTRAP.md](database/docs/CRM_PRODUCTION_BOOTSTRAP.md): catálogos del CRM.
