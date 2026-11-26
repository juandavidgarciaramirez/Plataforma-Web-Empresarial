import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protección de rutas administrativas (Fase 8).
 *
 * El backend (NestJS) vive en un origen/puerto distinto, así que no puede
 * setear una cookie httpOnly en el dominio de Next.js. Como solución
 * pragmática para esta fase, `useAuth` (cliente) guarda el access token
 * también en una cookie legible (`access_token`) además de `localStorage`.
 * Este middleware solo verifica que la cookie exista — la validez real del
 * token (firma/expiración) la sigue validando el backend en cada request
 * vía `JwtAuthGuard`. Si el token es inválido o expiró, el interceptor de
 * `src/lib/api/axios.ts` redirige a `/login` en el primer 401.
 */
const PROTECTED_PREFIX = "/admin";
const LOGIN_PATH = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
