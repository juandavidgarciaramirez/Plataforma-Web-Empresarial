/**
 * Destino del botón «Volver» de la página de inicio de sesión.
 *
 * `router.back()` solo es seguro si la entrada anterior del historial es una
 * página de este mismo sitio a la que tenga sentido regresar: nunca un sitio
 * externo (o ninguna, si el usuario abrió `/login` directamente), ni
 * `/admin/*` — sin sesión, `middleware.ts` lo rebotaría otra vez a `/login`
 * —, ni otra página del propio flujo de acceso, que provocaría un ir y venir
 * `/login` ↔ `/forgot-password`. En todos esos casos se va al inicio.
 */
export const BACK_FALLBACK_PATH = "/";

const NON_RETURNABLE_PREFIXES = ["/admin", "/login", "/forgot-password", "/reset-password"];

export type BackTarget = { kind: "history" } | { kind: "path"; href: string };

// Subconjunto de la Navigation API que se usa aquí (no está en los tipos del DOM de TS).
interface NavigationHistory {
  currentEntry: { index: number } | null;
  entries(): Array<{ url: string | null }>;
}

/** Ruta interna (pathname + query + hash) si `url` es del mismo origen y válida como retorno. */
function toReturnablePath(url: string | null | undefined): string | null {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url, window.location.origin);
  } catch {
    return null;
  }

  if (parsed.origin !== window.location.origin) return null;

  const { pathname } = parsed;
  const blocked = NON_RETURNABLE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return blocked ? null : `${pathname}${parsed.search}${parsed.hash}`;
}

export function resolveBackTarget(): BackTarget {
  const fallback: BackTarget = { kind: "path", href: BACK_FALLBACK_PATH };
  if (typeof window === "undefined") return fallback;

  try {
    // Navigation API (Chromium, Safari 26.2+, Firefox 147+): `entries()` solo
    // contiene las entradas contiguas del mismo origen, así que la anterior a
    // la actual es exactamente a donde llevaría `router.back()`. Índice 0 =
    // el usuario llegó desde fuera del sitio o abrió la URL directamente.
    const { navigation } = window as Window & { navigation?: NavigationHistory };
    if (navigation?.currentEntry && typeof navigation.entries === "function") {
      const { index } = navigation.currentEntry;
      const previous = index > 0 ? navigation.entries()[index - 1] : undefined;
      return toReturnablePath(previous?.url) ? { kind: "history" } : fallback;
    }

    // Sin Navigation API solo queda `document.referrer`, que Next no actualiza
    // en la navegación cliente: únicamente sirve si esta página se cargó como
    // documento completo. Aun así puede no ser la entrada inmediatamente
    // anterior (pudo haber navegación cliente después), por eso se navega a
    // esa ruta en lugar de usar `router.back()`.
    const [documentLoad] = performance.getEntriesByType("navigation");
    if (!documentLoad || new URL(documentLoad.name).pathname !== window.location.pathname) {
      return fallback;
    }

    const href = toReturnablePath(document.referrer);
    return href ? { kind: "path", href } : fallback;
  } catch {
    return fallback;
  }
}
