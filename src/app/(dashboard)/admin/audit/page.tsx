"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auditService } from "@/services/audit.service";
import { History } from "lucide-react";

export default function AdminAuditPage() {
  const [actionFilter, setActionFilter] = useState("");

  const { data: entries, isLoading } = useQuery({
    queryKey: ["admin-audit", actionFilter],
    queryFn: () => auditService.getAll({ action: actionFilter || undefined, limit: 100 }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Auditoría</h1>
        <p className="text-muted-foreground">
          Bitácora del sistema: inicios de sesión, creaciones, ediciones, eliminaciones, asignaciones y cambios de etapa.
        </p>
      </div>

      <div className="max-w-sm space-y-2">
        <Label className="text-sm text-muted-foreground">Filtrar por acción (p. ej. &quot;opportunities.&quot;, &quot;auth.&quot;)</Label>
        <Input
          placeholder="leads.create, users.update…"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Fecha</th>
                <th className="pb-2 font-medium">Actor</th>
                <th className="pb-2 font-medium">Acción</th>
                <th className="pb-2 font-medium">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    Cargando…
                  </td>
                </tr>
              )}
              {!isLoading && entries?.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted-foreground">
                    <History className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                    Sin actividad registrada todavía.
                  </td>
                </tr>
              )}
              {entries?.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0">
                  <td className="py-3 text-muted-foreground">{new Date(entry.createdAt).toLocaleString("es-CO")}</td>
                  <td className="py-3 text-muted-foreground">{entry.actorEmail}</td>
                  <td className="py-3">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">{entry.action}</code>
                  </td>
                  <td className="py-3">{entry.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
