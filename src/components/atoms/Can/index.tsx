"use client";

import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface CanProps {
  /** Requiere TODOS estos permisos (si se pasa más de uno). */
  permission?: string;
  permissions?: string[];
  /** Si es true, basta con tener alguno de `permissions` (por defecto requiere todos). */
  any?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Gate de UI: oculta `children` si el usuario no tiene el/los permiso(s)
 * indicados. Puramente cosmético — ver `usePermissions`.
 */
export function Can({ permission, permissions, any = false, fallback = null, children }: CanProps) {
  const { has, hasAny, hasAll } = usePermissions();

  const required = permission ? [permission] : (permissions ?? []);
  if (required.length === 0) return <>{children}</>;

  const allowed = permission ? has(permission) : any ? hasAny(required) : hasAll(required);

  return <>{allowed ? children : fallback}</>;
}
