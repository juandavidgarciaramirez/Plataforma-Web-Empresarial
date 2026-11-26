"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Deriva utilidades de autorización a partir de `useAuth().user.permissions`
 * (ya resuelto por el backend en `/auth/me` y en el login — ver
 * `JwtAuthGuard` en `backend/src/common/guards/jwt-auth.guard.ts`).
 *
 * IMPORTANTE: esto solo oculta UI (botones, ítems de menú, rutas). La
 * autorización real siempre la valida el backend vía `@Permissions()` +
 * `PermissionsGuard`; ocultar algo aquí nunca reemplaza esa validación.
 */
export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(() => new Set(user?.permissions ?? []), [user?.permissions]);

  const has = (permission: string) => permissions.has(permission);
  const hasAny = (perms: string[]) => perms.some((p) => permissions.has(p));
  const hasAll = (perms: string[]) => perms.every((p) => permissions.has(p));

  return { permissions, has, hasAny, hasAll };
}
