"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Can } from "@/components/atoms/Can";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  opportunitiesService,
  pipelineService,
  OPPORTUNITY_STAGES,
  type OpportunityStage,
} from "@/services/crm/opportunities.service";
import toast from "react-hot-toast";

const STAGE_LABELS: Record<OpportunityStage, string> = {
  NEW: "Nuevo",
  QUALIFYING: "Calificando",
  PROPOSAL: "Propuesta",
  NEGOTIATION: "Negociación",
  WON: "Ganada",
  LOST: "Perdida",
};

const STAGE_HEADER_STYLES: Record<OpportunityStage, string> = {
  NEW: "border-t-blue-400",
  QUALIFYING: "border-t-amber-400",
  PROPOSAL: "border-t-violet-400",
  NEGOTIATION: "border-t-orange-400",
  WON: "border-t-emerald-400",
  LOST: "border-t-slate-400",
};

const currency = (value: number, code = "COP") =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(value);

export default function AdminPipelinePage() {
  const queryClient = useQueryClient();
  const { has } = usePermissions();
  const canDrag = has("opportunities.changeStage");
  const [dragOverStage, setDragOverStage] = useState<OpportunityStage | null>(null);

  const { data: columns, isLoading } = useQuery({
    queryKey: ["crm-pipeline"],
    queryFn: pipelineService.getBoard,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["crm-pipeline"] });
    queryClient.invalidateQueries({ queryKey: ["admin-opportunities"] });
  };

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: OpportunityStage }) =>
      opportunitiesService.changeStage(id, stage),
    onSuccess: () => {
      toast.success("Oportunidad movida");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo mover la oportunidad"),
  });

  // Sección 23 del brief: drag & drop entre columnas. El selector de cada
  // tarjeta se conserva como alternativa accesible (teclado / táctil).
  const handleDrop = (stage: OpportunityStage) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStage(null);
    const id = e.dataTransfer.getData("text/plain");
    if (id) stageMutation.mutate({ id, stage });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Pipeline</h1>
        <p className="text-muted-foreground">
          Oportunidades agrupadas por etapa — arrastra una tarjeta a otra columna, o usa el selector.
        </p>
      </div>

      {isLoading && <p className="text-center text-muted-foreground">Cargando…</p>}

      <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {columns?.map((column) => (
          <div
            key={column.stage}
            onDragOver={(e) => {
              if (!canDrag) return;
              e.preventDefault();
              setDragOverStage(column.stage);
            }}
            onDragLeave={() => setDragOverStage((s) => (s === column.stage ? null : s))}
            onDrop={canDrag ? handleDrop(column.stage) : undefined}
            className={`flex min-w-[220px] flex-col rounded-xl border-t-4 bg-slate-50 p-3 transition-colors ${STAGE_HEADER_STYLES[column.stage]} ${
              dragOverStage === column.stage ? "bg-blue-50 ring-2 ring-blue-300" : ""
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">{STAGE_LABELS[column.stage]}</p>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 shadow-sm">
                {column.count}
              </span>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">{currency(column.totalValue)}</p>

            <div className="space-y-2">
              {column.opportunities.map((o) => (
                <div
                  key={o.id}
                  draggable={canDrag}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", o.id);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  className={`rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${
                    canDrag ? "cursor-grab active:cursor-grabbing" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-slate-900">{o.title}</p>
                  <p className="mb-2 text-xs text-muted-foreground">{currency(o.value, o.currency)}</p>
                  <Can permission="crm.opportunities.change_stage">
                    <Select
                      value={o.stage}
                      onValueChange={(v) => stageMutation.mutate({ id: o.id, stage: v as OpportunityStage })}
                    >
                      <SelectTrigger className="h-7 w-full text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPPORTUNITY_STAGES.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {STAGE_LABELS[stage]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Can>
                </div>
              ))}
              {column.opportunities.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-200 p-3 text-center text-xs text-muted-foreground">
                  Sin oportunidades
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
