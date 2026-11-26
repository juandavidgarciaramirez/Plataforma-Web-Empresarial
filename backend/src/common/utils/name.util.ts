/**
 * Descompone un nombre completo en `first_name`/`last_name` — varias tablas
 * reales (`security.users`, `core.contacts`) separan el nombre en columnas
 * `NOT NULL` distintas en vez de un solo campo `name` como usa la app.
 * Sin apellido separable, se reutiliza el mismo nombre en ambas columnas en
 * vez de inventar un apellido (mismo criterio que `PrismaUserRepository`,
 * Etapa 2).
 */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: trimmed };
  }
  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1),
  };
}
