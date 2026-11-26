-- Verificación de sólo lectura de 007_team_members_seed_and_public_content.sql.

SELECT id, name, position, org_level, parent_id, connector_curve, is_transversal, service_code, is_active
FROM content.team_members
ORDER BY sort_order;

-- Debe haber exactamente 6 filas, todas con parent_id apuntando a Jennifer Zuluaga salvo ella misma.
SELECT count(*) AS total FROM content.team_members;
SELECT count(*) AS con_padre_jennifer FROM content.team_members
WHERE parent_id = (SELECT id FROM content.team_members WHERE name = 'Jennifer Zuluaga');
