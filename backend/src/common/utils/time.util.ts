const UNIT_SECONDS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
};

/** Convierte expresiones tipo "15m", "7d", "60s" (formato de @nestjs/jwt) a segundos. */
export function parseDurationToSeconds(value: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(value.trim());
  if (!match) {
    const asNumber = Number(value);
    return Number.isFinite(asNumber) ? asNumber : 900; // fallback: 15 minutos
  }
  const [, amount, unit] = match;
  return Number(amount) * UNIT_SECONDS[unit];
}
