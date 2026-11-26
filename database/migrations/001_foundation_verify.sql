\echo '--- foundation tables ---'
SELECT tablename FROM pg_tables WHERE schemaname='foundation' ORDER BY 1;
\echo '--- core table count (expect 20) ---'
SELECT count(*) FROM pg_tables WHERE schemaname='core';
\echo '--- foundation sequences (expect 8) ---'
SELECT schemaname, sequencename FROM pg_sequences WHERE schemaname='foundation' ORDER BY 1,2;
\echo '--- FKs pointing into foundation.files ---'
SELECT conrelid::regclass AS table_name, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE confrelid = 'foundation.files'::regclass
ORDER BY 1;
\echo '--- leftover file% tables in core (expect none) ---'
SELECT tablename FROM pg_tables WHERE schemaname='core' AND tablename LIKE 'file%';
