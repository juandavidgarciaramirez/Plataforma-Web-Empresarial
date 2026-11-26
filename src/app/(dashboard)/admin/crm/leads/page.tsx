"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Can } from "@/components/atoms/Can";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  leadsService,
  type ApiLead,
  type LeadSource,
  type LeadStatus,
} from "@/services/crm/leads.service";
import { ArrowRightCircle, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const SOURCES: LeadSource[] = ["YURI", "WEBSITE_FORM", "REFERRAL", "MANUAL", "CHAT", "PQR"];
const STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "DISQUALIFIED", "CONVERTED"];

const SOURCE_LABELS: Record<LeadSource, string> = {
  YURI: "Yuri (chatbot)",
  WEBSITE_FORM: "Formulario web",
  REFERRAL: "Referido",
  MANUAL: "Manual",
  CHAT: "Chat",
  PQR: "PQR",
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  QUALIFIED: "Calificado",
  DISQUALIFIED: "Descartado",
  CONVERTED: "Convertido",
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: "bg-blue-50 text-blue-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  QUALIFIED: "bg-emerald-50 text-emerald-700",
  DISQUALIFIED: "bg-slate-100 text-slate-500",
  CONVERTED: "bg-violet-50 text-violet-700",
};

interface FormState {
  id?: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  source: LeadSource;
  serviceInterest: string;
  status: LeadStatus;
  notes: string;
}

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  source: "MANUAL",
  serviceInterest: "",
  status: "NEW",
  notes: "",
};

export default function AdminLeadsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "ALL">("ALL");

  const { data: leads, isLoading } = useQuery({
    queryKey: ["admin-leads", sourceFilter],
    queryFn: () => leadsService.getAll(sourceFilter === "ALL" ? undefined : { source: sourceFilter }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-leads"] });

  const createMutation = useMutation({
    mutationFn: leadsService.create,
    onSuccess: () => {
      toast.success("Lead creado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear el lead"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: FormState) => leadsService.update(id!, data),
    onSuccess: () => {
      toast.success("Lead actualizado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar el lead"),
  });

  const deleteMutation = useMutation({
    mutationFn: leadsService.remove,
    onSuccess: () => {
      toast.success("Lead eliminado");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar el lead"),
  });

  const convertMutation = useMutation({
    mutationFn: (id: string) => leadsService.convert(id),
    onSuccess: () => {
      toast.success("Lead convertido a oportunidad");
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["admin-opportunities"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo convertir el lead"),
  });

  const startEdit = (lead: ApiLead) =>
    setForm({
      id: lead.id,
      name: lead.name,
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      companyName: lead.companyName ?? "",
      source: lead.source,
      serviceInterest: lead.serviceInterest ?? "",
      status: lead.status,
      notes: lead.notes ?? "",
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">Prospectos captados por el equipo comercial, el sitio web y Yuri</p>
        </div>
        <Can permission="crm.leads.create">
          <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo lead
          </Button>
        </Can>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-sm text-muted-foreground">Fuente:</Label>
        <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as LeadSource | "ALL")}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las fuentes</SelectItem>
            {SOURCES.map((source) => (
              <SelectItem key={source} value={source}>
                {SOURCE_LABELS[source]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {form && (
        <Card title={form.id ? "Editar lead" : "Crear lead"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Fuente</Label>
              <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v as LeadSource })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {SOURCE_LABELS[source]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as LeadStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Servicio de interés</Label>
              <Input
                placeholder="capital-hse, capital-learning…"
                value={form.serviceInterest}
                onChange={(e) => setForm({ ...form, serviceInterest: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Notas</Label>
              <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex items-end gap-2 md:col-span-2">
              <Button type="submit" variant="corporate" loading={createMutation.isPending || updateMutation.isPending}>
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
                <th className="pb-2 font-medium">Nombre</th>
                <th className="pb-2 font-medium">Empresa</th>
                <th className="pb-2 font-medium">Fuente</th>
                <th className="pb-2 font-medium">Estado</th>
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
              {!isLoading && leads?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Sin leads todavía.
                  </td>
                </tr>
              )}
              {leads?.map((lead) => (
                <tr key={lead.id} className="border-b last:border-0">
                  <td className="py-3">
                    <p className="font-medium text-slate-900">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email || lead.phone || "—"}</p>
                  </td>
                  <td className="py-3 text-muted-foreground">{lead.companyName || "—"}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        lead.source === "YURI" ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {lead.source === "YURI" && <Sparkles className="h-3 w-3" />}
                      {SOURCE_LABELS[lead.source]}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[lead.status]}`}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      {lead.status !== "CONVERTED" && (
                        <Can permission="crm.leads.convert">
                          <button
                            onClick={() => convertMutation.mutate(lead.id)}
                            className="rounded p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                            aria-label="Convertir a oportunidad"
                            title="Convertir a oportunidad"
                          >
                            <ArrowRightCircle className="h-4 w-4" />
                          </button>
                        </Can>
                      )}
                      <Can permission="crm.leads.update">
                        <button
                          onClick={() => startEdit(lead)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Can>
                      <Can permission="crm.leads.delete">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar el lead de ${lead.name}?`)) deleteMutation.mutate(lead.id);
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
