-- Verificación de sólo lectura de 003_crm_catalog.sql.

SELECT count(*) AS total_lead_sources FROM crm.lead_sources;

SELECT name FROM crm.lead_sources
WHERE name IN ('Yuri (Chatbot)', 'Registro Manual', 'Chat en Vivo', 'PQR')
ORDER BY 1;

SELECT id, legal_name, is_active FROM core.companies WHERE legal_name = 'Contactos Independientes (Sin Empresa)';

SELECT table_name FROM information_schema.tables WHERE table_schema = 'crm' AND table_name IN ('opportunities', 'tasks');

SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_schema = 'crm' AND table_name = 'opportunities' ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_schema = 'crm' AND table_name = 'tasks' ORDER BY ordinal_position;

-- Las 44/76 filas de permisos y demás tablas previas no deben haber cambiado.
SELECT count(*) AS total_leads_existentes FROM crm.leads;
SELECT count(*) AS total_companies_existentes FROM core.companies;
