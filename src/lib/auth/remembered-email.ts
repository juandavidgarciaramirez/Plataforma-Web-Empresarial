/**
 * «Recordar mi usuario» del login: persiste ÚNICAMENTE el correo con el que
 * el usuario inició sesión, para rellenarlo en su próxima visita.
 *
 * Es deliberadamente independiente de `tokens.ts`: aquí nunca se guarda la
 * contraseña ni ningún token, y cerrar sesión no borra el correo recordado
 * — eso solo ocurre cuando el usuario desmarca la casilla.
 */
export const REMEMBERED_EMAIL_KEY = "remembered_login_email";

// Cota de longitud (RFC 5321) y forma mínima de correo: si en la clave hay
// otra cosa (editada a mano, un token pegado por error...) se descarta en
// lugar de volcarla en el formulario.
const MAX_EMAIL_LENGTH = 254;
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRememberableEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_LENGTH && EMAIL_SHAPE.test(value);
}

/** Correo recordado, o `null` si no hay ninguno (o no hay `localStorage`: SSR, modo privado). */
export function getRememberedEmail(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (!value) return null;
    if (isRememberableEmail(value)) return value;

    window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    return null;
  } catch {
    return null;
  }
}

/** Recuerda (o reemplaza) el correo. Llamar solo tras un inicio de sesión exitoso. */
export function rememberEmail(email: string) {
  const value = email.trim();
  if (typeof window === "undefined" || !isRememberableEmail(value)) return;

  try {
    window.localStorage.setItem(REMEMBERED_EMAIL_KEY, value);
  } catch {
    // Almacenamiento no disponible o lleno: simplemente no se recordará.
  }
}

/** Olvida el correo recordado. No lanza si `localStorage` no está disponible. */
export function forgetRememberedEmail() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  } catch {
    // Nada que limpiar si el almacenamiento no está disponible.
  }
}
