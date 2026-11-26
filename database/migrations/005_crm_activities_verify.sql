-- Verificación de sólo lectura de 005_crm_activities.sql.

SELECT table_name FROM information_schema.tables WHERE table_schema = 'crm' AND table_name = 'activities';

SELECT column_name, data_type, is_nullable FROM information_schema.columns
WHERE table_schema = 'crm' AND table_name = 'activities' ORDER BY ordinal_position;

-- lead_activities no debe haber cambiado.
SELECT count(*) AS total_lead_activities FROM crm.lead_activities;
