import json
import urllib.parse
import urllib.request
from pathlib import Path


DANE_URL = (
    "https://geoportal.dane.gov.co/mparcgis/rest/services/"
    "Divipola/Serv_DIVIPOLA_MGN_2025/FeatureServer/317/query"
)

OUTPUT_FILE = Path(__file__).parent / "municipios_divipola.sql"

params = {
    "where": "1=1",
    "outFields": "DPTO_CCDGO,MPIO_CCDGO,MPIO_CDPMP,MPIO_CNMBRE",
    "returnGeometry": "false",
    "orderByFields": "MPIO_CDPMP",
    "f": "json",
}

url = DANE_URL + "?" + urllib.parse.urlencode(params)

print("Consultando DANE...")
print(url)

request = urllib.request.Request(
    url,
    headers={
        "User-Agent": "JudPlatform-DIVIPOLA-Importer/1.0"
    },
)

with urllib.request.urlopen(request, timeout=60) as response:
    data = json.load(response)


if "error" in data:
    raise RuntimeError(
        f"Error devuelto por DANE: {data['error']}"
    )


features = data.get("features", [])

if not features:
    raise RuntimeError(
        "DANE no devolvió municipios."
    )


print(f"Municipios recibidos: {len(features)}")


def sql_escape(value):
    if value is None:
        return "NULL"

    value = str(value).replace("'", "''")

    return f"'{value}'"


lines = []

lines.append("-- =====================================================")
lines.append("-- DIVIPOLA MGN 2025 - MUNICIPIOS DE COLOMBIA")
lines.append("-- Fuente: DANE")
lines.append("-- Generado automáticamente")
lines.append("-- =====================================================")
lines.append("")
lines.append("BEGIN;")
lines.append("")


for feature in features:
    attrs = feature.get("attributes", {})

    dpto_code = attrs.get("DPTO_CCDGO")
    mpio_code = attrs.get("MPIO_CCDGO")
    divipola = attrs.get("MPIO_CDPMP")
    name = attrs.get("MPIO_CNMBRE")

    if not divipola or not name or not dpto_code:
        continue

    divipola = str(divipola).zfill(5)
    dpto_code = str(dpto_code).zfill(2)

    lines.append(
        f"""
INSERT INTO core.cities (
    state_id,
    name,
    divipola_code,
    is_active
)
SELECT
    s.id,
    {sql_escape(name)},
    {sql_escape(divipola)},
    true
FROM core.states s
WHERE s.divipola_code = {sql_escape(dpto_code)}
ON CONFLICT (divipola_code) DO UPDATE
SET
    name = EXCLUDED.name,
    state_id = EXCLUDED.state_id,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;
""".strip()
    )

    lines.append("")


lines.append("")
lines.append("COMMIT;")
lines.append("")


OUTPUT_FILE.write_text(
    "\n".join(lines),
    encoding="utf-8",
)

print()
print("==============================================")
print("SQL generado correctamente")
print("==============================================")
print(f"Archivo: {OUTPUT_FILE}")
print(f"Municipios recibidos: {len(features)}")