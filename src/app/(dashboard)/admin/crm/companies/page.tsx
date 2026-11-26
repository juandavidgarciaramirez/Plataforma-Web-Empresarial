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
  companiesService,
  type ApiCompany,
  type CompanySize,
  type CompanyStatus,
} from "@/services/crm/companies.service";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const SIZES: CompanySize[] = ["MICRO", "SMALL", "MEDIUM", "LARGE"];
const SIZE_LABELS: Record<CompanySize, string> = {
  MICRO: "Microempresa",
  SMALL: "Pequeña",
  MEDIUM: "Mediana",
  LARGE: "Grande",
};

interface FormState {
  id?: string;
  name: string;
  taxId: string;
  industry: string;
  sizeSegment: CompanySize | "";
  website: string;
  address: string;
  phone: string;
  status: CompanyStatus;
}

const emptyForm: FormState = {
  name: "",
  taxId: "",
  industry: "",
  sizeSegment: "",
  website: "",
  address: "",
  phone: "",
  status: "ACTIVE",
};

export default function AdminCompaniesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);

  const { data: companies, isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: companiesService.getAll,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-companies"] });

  const toPayload = (data: FormState) => ({
    name: data.name,
    taxId: data.taxId || undefined,
    industry: data.industry || undefined,
    sizeSegment: data.sizeSegment || undefined,
    website: data.website || undefined,
    address: data.address || undefined,
    phone: data.phone || undefined,
    status: data.status,
  });

  const createMutation = useMutation({
    mutationFn: (data: FormState) => companiesService.create(toPayload(data)),
    onSuccess: () => {
      toast.success("Empresa creada");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear la empresa"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: FormState) => companiesService.update(id!, toPayload(data)),
    onSuccess: () => {
      toast.success("Empresa actualizada");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar la empresa"),
  });

  const deleteMutation = useMutation({
    mutationFn: companiesService.remove,
    onSuccess: () => {
      toast.success("Empresa eliminada");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar la empresa"),
  });

  const startEdit = (company: ApiCompany) =>
    setForm({
      id: company.id,
      name: company.name,
      taxId: company.taxId ?? "",
      industry: company.industry ?? "",
      sizeSegment: company.sizeSegment ?? "",
      website: company.website ?? "",
      address: company.address ?? "",
      phone: company.phone ?? "",
      status: company.status,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Empresas</h1>
          <p className="text-muted-foreground">Cuentas comerciales del CRM</p>
        </div>
        <Can permission="crm.companies.create">
          <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Nueva empresa
          </Button>
        </Can>
      </div>

      {form && (
        <Card title={form.id ? "Editar empresa" : "Crear empresa"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>NIT</Label>
              <Input value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Industria</Label>
              <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Tamaño</Label>
              <Select
                value={form.sizeSegment || undefined}
                onValueChange={(v) => setForm({ ...form, sizeSegment: v as CompanySize })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tamaño" />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {SIZE_LABELS[size]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sitio web</Label>
              <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Dirección</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as CompanyStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activa</SelectItem>
                  <SelectItem value="INACTIVE">Inactiva</SelectItem>
                </SelectContent>
              </Select>
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
                <th className="pb-2 font-medium">Industria</th>
                <th className="pb-2 font-medium">Tamaño</th>
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
              {!isLoading && companies?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Sin empresas todavía.
                  </td>
                </tr>
              )}
              {companies?.map((company) => (
                <tr key={company.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">{company.name}</td>
                  <td className="py-3 text-muted-foreground">{company.industry || "—"}</td>
                  <td className="py-3 text-muted-foreground">
                    {company.sizeSegment ? SIZE_LABELS[company.sizeSegment] : "—"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        company.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {company.status === "ACTIVE" ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Can permission="crm.companies.update">
                        <button
                          onClick={() => startEdit(company)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Can>
                      <Can permission="crm.companies.delete">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la empresa ${company.name}?`)) deleteMutation.mutate(company.id);
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
