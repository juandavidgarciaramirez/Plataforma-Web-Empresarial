-- Verificación de sólo lectura de 010_pqr_careers_real_persistence.sql.

SELECT column_name FROM information_schema.columns WHERE table_schema='pqr' AND table_name='requests' AND column_name IN ('document_type','document_number');

SELECT column_name FROM information_schema.columns WHERE table_schema='careers' AND table_name='job_positions' AND column_name = 'department';
SELECT column_name FROM information_schema.columns WHERE table_schema='careers' AND table_name='candidates'
  AND column_name IN ('city','education_level','relocation','referral_source','sectors','salary_expectation_text');
SELECT column_name FROM information_schema.columns WHERE table_schema='careers' AND table_name='applications'
  AND column_name IN ('experience_range','consent_policy_version','consent_text','consent_ip','consent_communications','consent_share_cv','cv_file_id','desired_position');

-- Vacante placeholder real.
SELECT id, title, code, status, vacancies FROM careers.job_positions WHERE code = 'base-altos-potenciales';

-- Catálogos reales de PQR ya sembrados (no tocados por esta migración, solo confirmados).
SELECT count(*) AS tipos FROM pqr.request_types;
SELECT count(*) AS estados FROM pqr.request_statuses;
SELECT count(*) AS prioridades FROM pqr.request_priorities;

-- Nada existente debe haberse alterado.
SELECT count(*) AS total_requests FROM pqr.requests;
SELECT count(*) AS total_applications FROM careers.applications;
SELECT count(*) AS total_job_positions_reales FROM careers.job_positions WHERE code != 'base-altos-potenciales';
