"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Can } from "@/components/atoms/Can";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pqrAdminService, type ApiPqr, type PqrStatus } from "@/services/pqr.service";
import { leadsService } from "@/services/crm/leads.service";
import { MessageSquareReply, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const TYPE_LABELS: Record<string, string> = {
  PETICION: "Petición",
  QUEJA: "Queja",
  RECLAMO: "Reclamo",
  SUGERENCIA: "Sugerencia",
};

const STATUS_LABELS: Record<PqrStatus, string> = {
  OPEN: "Abierta",
  IN_PROGRESS: "En proceso",
  CLOSED: "Cerrada",
};

const STATUS_STYLES: Record<PqrStatus, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  CLOSED: "bg-emerald-50 text-emerald-700",
};

export default function AdminPqrPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<ApiPqr | null>(null);
  const [response, setResponse] = useState("");

  const { data: items, isLoading } = useQuery({ queryKey: ["admin-pqr"], queryFn: pqrAdminService.getAll });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-pqr"] });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: PqrStatus }) => pqrAdminService.update(id, { status }),
    onSuccess: () => {
      toast.success("Estado actualizado");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar el estado"),
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) =>
      pqrAdminService.update(id, { response, status: "CLOSED" }),
    onSuccess: () => {
      toast.success("Respuesta enviada");
      setSelected(null);
      setResponse("");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo enviar la respuesta"),
  });

  // Sección 32 del brief: "PQR → Crear lead" — acción manual del admin, no
  // toda PQR se convierte en lead automáticamente.
  const createLeadMutation = useMutation({
    mutationFn: (item: ApiPqr) =>
      leadsService.create({
        name: item.fullName,
        email: item.email,
        phone: item.phone ?? undefined,
        source: "PQR",
        notes: `${item.subject}\n\n${item.description}`,
      }),
    onSuccess: () => toast.success("Lead creado en el CRM"),
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear el lead"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">PQR</h1>
        <p className="text-muted-foreground">Peticiones, quejas, reclamos y sugerencias radicadas en el sitio</p>
      </div>

      {selected && (
        <Card title={`Responder ${selected.radicado}`}>
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-700">{selected.subject}</p>
              <p className="mt-1 text-muted-foreground">{selected.description}</p>
            </div>
            <Textarea
              rows={4}
              placeholder="Escribe la respuesta para el ciudadano…"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                variant="corporate"
                loading={respondMutation.isPending}
                onClick={() => response.trim() && respondMutation.mutate({ id: selected.id, response })}
              >
                Enviar respuesta y cerrar
              </Button>
              <Button variant="outline" onClick={() => setSelected(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Radicado</th>
                <th className="pb-2 font-medium">Tipo</th>
                <th className="pb-2 font-medium">Asunto</th>
                <th className="pb-2 font-medium">Ciudadano</th>
                <th className="pb-2 font-medium">Estado</th>
                <th className="pb-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    Cargando…
                  </td>
                </tr>
              )}
              {items?.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">{item.radicado}</td>
                  <td className="py-3 text-muted-foreground">{TYPE_LABELS[item.type] ?? item.type}</td>
                  <td className="py-3 text-muted-foreground">{item.subject}</td>
                  <td className="py-3 text-muted-foreground">{item.fullName}</td>
                  <td className="py-3">
                    <Can
                      permission="pqrs.tickets.update"
                      fallback={
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status]}`}>
                          {STATUS_LABELS[item.status]}
                        </span>
                      }
                    >
                      <Select
                        value={item.status}
                        onValueChange={(v) => statusMutation.mutate({ id: item.id, status: v as PqrStatus })}
                      >
                        <SelectTrigger className={`h-8 w-36 border-0 text-xs font-medium ${STATUS_STYLES[item.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(STATUS_LABELS) as PqrStatus[]).map((s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Can>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-1">
                      <Can permission="crm.leads.create">
                        <button
                          onClick={() => createLeadMutation.mutate(item)}
                          disabled={createLeadMutation.isPending}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 disabled:opacity-50"
                          aria-label="Crear lead"
                          title="Crear lead"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                      </Can>
                      <Can permission="pqrs.tickets.update">
                        <button
                          onClick={() => {
                            setSelected(item);
                            setResponse(item.response ?? "");
                          }}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          aria-label="Responder"
                          title="Responder"
                        >
                          <MessageSquareReply className="h-4 w-4" />
                        </button>
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
