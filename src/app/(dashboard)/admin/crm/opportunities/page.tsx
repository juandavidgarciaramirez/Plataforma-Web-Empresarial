"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Can } from "@/components/atoms/Can";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  opportunitiesService,
  OPPORTUNITY_STAGES,
  type ApiOpportunity,
  type OpportunityStage,
} from "@/services/crm/opportunities.service";
import { companiesService } from "@/services/crm/companies.service";
import { CheckCircle2, Plus, Trash2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const STAGE_LABELS: Record<OpportunityStage, string> = {
  NEW: "Nuevo",
  QUALIFYING: "Calificando",
  PROPOSAL: "Propuesta",
  NEGOTIATION: "Negociación",
  WON: "Ganada",
  LOST: "Perdida",
};

const STAGE_STYLES: Record<OpportunityStage, string> = {
  NEW: "bg-blue-50 text-blue-700",
  QUALIFYING: "bg-amber-50 text-amber-700",
  PROPOSAL: "bg-violet-50 text-violet-700",
  NEGOTIATION: "bg-orange-50 text-orange-700",
  WON: "bg-emerald-50 text-emerald-700",
  LOST: "bg-slate-100 text-slate-500",
};

const currency = (value: number, code: string) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(value);

interface FormState {
  title: string;
  companyId: string;
  value: string;
  currency: string;
}

const emptyForm: FormState = { title: "", companyId: "", value: "0", currency: "COP" };

export default function AdminOpportunitiesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["admin-opportunities"],
    queryFn: () => opportunitiesService.getAll(),
  });
  const { data: companies } = useQuery({ queryKey: ["admin-companies-catalog"], queryFn: companiesService.getAll });

  const companyName = (id: string | null) => companies?.find((c) => c.id === id)?.name ?? "—";

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-opportunities"] });
    queryClient.invalidateQueries({ queryKey: ["crm-pipeline"] });
  };

  const createMutation = useMutation({
    mutationFn: (data: FormState) =>
      opportunitiesService.create({
        title: data.title,
        companyId: data.companyId || undefined,
        value: Number(data.value) || 0,
        currency: data.currency,
      }),
    onSuccess: () => {
      toast.success("Oportunidad creada");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear la oportunidad"),
  });

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: OpportunityStage }) =>
      opportunitiesService.changeStage(id, stage),
    onSuccess: () => {
      toast.success("Etapa actualizada");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo cambiar la etapa"),
  });

  const closeMutation = useMutation({
    mutationFn: ({ id, outcome }: { id: string; outcome: "WON" | "LOST" }) =>
      opportunitiesService.close(id, outcome),
    onSuccess: (_, variables) => {
      toast.success(variables.outcome === "WON" ? "Oportunidad ganada" : "Oportunidad marcada como perdida");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo cerrar la oportunidad"),
  });

  const deleteMutation = useMutation({
    mutationFn: opportunitiesService.remove,
    onSuccess: () => {
      toast.success("Oportunidad eliminada");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar la oportunidad"),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    createMutation.mutate(form);
  };

  const isClosed = (o: ApiOpportunity) => o.stage === "WON" || o.stage === "LOST";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Oportunidades</h1>
          <p className="text-muted-foreground">Negocios en curso — ver también el tablero de Pipeline</p>
        </div>
        <Can permission="crm.opportunities.create">
          <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Nueva oportunidad
          </Button>
        </Can>
      </div>

      {form && (
        <Card title="Crear oportunidad">
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Título</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select value={form.companyId || undefined} onValueChange={(v) => setForm({ ...form, companyId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin empresa asociada" />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor (COP)</Label>
              <Input
                type="number"
                min={0}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-2 md:col-span-2">
              <Button type="submit" variant="corporate" loading={createMutation.isPending}>
                Guardar
              </Button>
              <Button type="button" variant="outline" onClick={() => setForm(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Título</th>
                <th className="pb-2 font-medium">Empresa</th>
                <th className="pb-2 font-medium">Valor</th>
                <th className="pb-2 font-medium">Etapa</th>
                <th className="pb-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Cargando…
                  </td>
                </tr>
              )}
              {!isLoading && opportunities?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Sin oportunidades todavía.
                  </td>
                </tr>
              )}
              {opportunities?.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">{o.title}</td>
                  <td className="py-3 text-muted-foreground">{companyName(o.companyId)}</td>
                  <td className="py-3 text-muted-foreground">{currency(o.value, o.currency)}</td>
                  <td className="py-3">
                    <Can permission="crm.opportunities.change_stage" fallback={
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STAGE_STYLES[o.stage]}`}>
                        {STAGE_LABELS[o.stage]}
                      </span>
                    }>
                      <Select
                        value={o.stage}
                        disabled={isClosed(o)}
                        onValueChange={(v) => stageMutation.mutate({ id: o.id, stage: v as OpportunityStage })}
                      >
                        <SelectTrigger className={`h-8 w-40 border-0 text-xs font-medium ${STAGE_STYLES[o.stage]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPPORTUNITY_STAGES.filter((s) => s !== "WON" && s !== "LOST").map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {STAGE_LABELS[stage]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Can>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      {!isClosed(o) && (
                        <Can permission="crm.opportunities.close">
                          <button
                            onClick={() => closeMutation.mutate({ id: o.id, outcome: "WON" })}
                            className="rounded p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                            aria-label="Marcar como ganada"
                            title="Ganada"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => closeMutation.mutate({ id: o.id, outcome: "LOST" })}
                            className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            aria-label="Marcar como perdida"
                            title="Perdida"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </Can>
                      )}
                      <Can permission="crm.opportunities.delete">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la oportunidad "${o.title}"?`)) deleteMutation.mutate(o.id);
                          }}
                          className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
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
