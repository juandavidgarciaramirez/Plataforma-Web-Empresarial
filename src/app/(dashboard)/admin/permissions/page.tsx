"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { permissionsService, type ApiPermission } from "@/services/roles.service";
import { KeyRound } from "lucide-react";

const MODULE_LABELS: Record<string, string> = {
  users: "Usuarios",
  roles: "Roles",
  services: "Servicios",
  news: "Noticias",
  blog: "Blog",
  team: "Equipo",
  pqr: "PQR",
  careers: "Talento",
  crm: "CRM",
  audit: "Auditoría",
};

export default function AdminPermissionsPage() {
  const { data: permissions, isLoading } = useQuery({
    queryKey: ["admin-permissions-catalog"],
    queryFn: permissionsService.getAll,
  });

  const grouped = (permissions ?? []).reduce<Record<string, ApiPermission[]>>((acc, permission) => {
    (acc[permission.module] ??= []).push(permission);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Permisos</h1>
        <p className="text-muted-foreground">
          Catálogo de permisos del sistema, agrupados por módulo. Se asignan a roles en{" "}
          <span className="font-medium">Roles</span>.
        </p>
      </div>

      {isLoading && (
        <Card>
          <p className="py-6 text-center text-muted-foreground">Cargando…</p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(grouped).map(([module, perms]) => (
          <Card key={module} title={MODULE_LABELS[module] ?? module}>
            <ul className="space-y-2">
              {perms.map((permission) => (
                <li key={permission.id} className="flex items-center gap-2 text-sm">
                  <KeyRound className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                  <code className="text-slate-700">{permission.key}</code>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
