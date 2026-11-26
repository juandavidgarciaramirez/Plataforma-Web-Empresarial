/**
 * Almacenamiento centralizado de los tokens de sesión (access + refresh).
 *
 * Se usa desde `useAuth` (login/logout) y desde el interceptor de
 * `src/lib/api/axios.ts` (renovación automática ante un 401), para que
 * ambos lados queden siempre sincronizados en `localStorage` y en la
 * cookie legible que consume `middleware.ts`.
 */
export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Cookie NO httpOnly, de solo lectura para `middleware.ts` (edge runtime,
 * sin acceso a localStorage). El backend NestJS corre en un origen/puerto
 * distinto al de Next.js, por lo que no puede setear cookies httpOnly aquí
 * directamente; esta es una solución pragmática para proteger rutas de
 * `/admin/*` en esta fase. El access token real (autorización de la API)
 * sigue viajando solo por el header `Authorization: Bearer`, vía
 * `src/lib/api/axios.ts`.
 */
function setAuthCookie(token: string) {
  document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
}

function clearAuthCookie() {
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0`;
}

/** Guarda (o reemplaza, tras una renovación) el par de tokens de sesión. */
export function storeTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  setAuthCookie(accessToken);
}

/** Limpia por completo la sesión local (logout, refresh fallido, 401 sin recuperación). */
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  clearAuthCookie();
}
