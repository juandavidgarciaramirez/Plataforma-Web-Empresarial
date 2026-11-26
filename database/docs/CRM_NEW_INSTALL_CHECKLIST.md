# Lista de comprobación: instalación nueva del CRM

Copia esta lista por cada instalación. El detalle de cada paso está en
[CRM_PRODUCTION_BOOTSTRAP.md](CRM_PRODUCTION_BOOTSTRAP.md).

| | |
|---|---|
| **Proyecto** | `<nombre>` |
| **Entorno** | `<desarrollo / pruebas / producción>` |
| **Responsable y fecha** | `<persona>`, `<AAAA-MM-DD>` |
| **Versión de PostgreSQL** | `<SHOW server_version>` |

## 1. Antes de empezar

- [ ] La base de destino es la correcta (`SELECT current_database()`).
- [ ] Hay una copia de seguridad reciente, si la base ya tiene datos.
- [ ] En un clon: `crm-catalog.json` y la migración tienen los valores de este proyecto, y `npm test` pasa.
- [ ] En un clon: reemplazada la identidad del negocio que sigue en el código (correos internos, firma, textos; ver la guía).
- [ ] No hay datos de demostración previstos para este entorno.

## 2. Variables de entorno

No escribas los valores en esta lista.

- [ ] `DATABASE_URL`, `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET`, con secretos propios de este entorno.
- [ ] `SEED_ADMIN_EMAIL`: una persona real que recibirá los leads automáticos.
- [ ] `SEED_ADMIN_PASSWORD`: una contraseña propia de este entorno, no la de un ejemplo.
- [ ] `NODE_ENV=production`, si es producción.
- [ ] Las variables también están en `backend/.env` (el verificador lee ese archivo).

## 3. Esquema y migraciones

- [ ] Esquema base aplicado.
- [ ] Migraciones estructurales aplicadas, en el orden de la guía.
- [ ] Contenido propio del negocio cargado (nunca el de otro proyecto).

## 4. Seguridad

- [ ] `npm run build && npm run seed:security` terminó sin error.
- [ ] Puedes iniciar sesión con el administrador.

## 5. Catálogos del CRM

- [ ] Ensayo con `ROLLBACK` correcto, sin `ERROR`.
- [ ] Migración aplicada con `-v ON_ERROR_STOP=1`.
- [ ] Migración de verificación correcta.
- [ ] `node scripts/verify-deploy.js crm` termina en `OK CRM catalog ready`, con estas líneas:
  - [ ] `OK Lead sources`
  - [ ] `OK Lead statuses`
  - [ ] `OK Default pipeline`
  - [ ] `OK Pipeline stages`
  - [ ] `OK No-company placeholder`
  - [ ] `OK CRM administrator`

## 6. Otros datos que necesita el código

- [ ] Migración 016 aplicada con el mismo procedimiento: ensayo, aplicar y verificar.
- [ ] `node scripts/verify-deploy.js crm` no muestra ningún `AVISO Catálogo`.
- [ ] Empresa propia en `core.companies`, con el nombre de `ownCompany` en `crm-catalog.json` (sin ella fallan las postulaciones, los adjuntos de PQR y la carga de imágenes). Ninguna migración la crea.

## 7. Despliegue

- [ ] `node scripts/verify-deploy.js preflight` termina en `todo correcto`.
- [ ] Revisados todos los `AVISO`: se resuelven o se aceptan por escrito.
- [ ] El despliegue terminó y `postflight` pasó.
- [ ] Los registros de la API no muestran errores de catálogo.

## 8. Prueba funcional del asistente

En producción, cada prueba crea un lead real: hazla solo con autorización e identifica el registro.

- [ ] Una cotización completa queda registrada, y el asistente lo confirma.
- [ ] En el panel, el lead tiene la fuente del asistente, estado Nuevo, etapa Nuevo y el pipeline predeterminado.
- [ ] Está asignado al administrador real y conserva el servicio de interés.
- [ ] Repetir la solicitud en la misma conversación no crea un segundo lead.
- [ ] Una conversación sin empresa deja el contacto en la empresa técnica y no crea una empresa nueva.
- [ ] El lead de prueba se retiró o se identificó.

## 9. Cierre

- [ ] Registro de migraciones actualizado.
- [ ] Pendientes anotados, con responsable.
