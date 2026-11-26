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
import { contactsService, type ApiContact } from "@/services/crm/contacts.service";
import { companiesService } from "@/services/crm/companies.service";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface FormState {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  companyId: string;
}

const emptyForm: FormState = { name: "", email: "", phone: "", position: "", companyId: "" };

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: contactsService.getAll,
  });
  const { data: companies } = useQuery({ queryKey: ["admin-companies-catalog"], queryFn: companiesService.getAll });

  const companyName = (id: string | null) => companies?.find((c) => c.id === id)?.name ?? "—";

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });

  const toPayload = (data: FormState) => ({
    name: data.name,
    email: data.email || undefined,
    phone: data.phone || undefined,
    position: data.position || undefined,
    companyId: data.companyId || undefined,
  });

  const createMutation = useMutation({
    mutationFn: (data: FormState) => contactsService.create(toPayload(data)),
    onSuccess: () => {
      toast.success("Contacto creado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear el contacto"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: FormState) => contactsService.update(id!, toPayload(data)),
    onSuccess: () => {
      toast.success("Contacto actualizado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar el contacto"),
  });

  const deleteMutation = useMutation({
    mutationFn: contactsService.remove,
    onSuccess: () => {
      toast.success("Contacto eliminado");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar el contacto"),
  });

  const startEdit = (contact: ApiContact) =>
    setForm({
      id: contact.id,
      name: contact.name,
      email: contact.email ?? "",
      phone: contact.phone ?? "",
      position: contact.position ?? "",
      companyId: contact.companyId ?? "",
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
          <h1 className="font-display text-3xl font-bold">Contactos</h1>
          <p className="text-muted-foreground">Personas de contacto dentro de cada empresa</p>
        </div>
        <Can permission="crm.contacts.create">
          <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo contacto
          </Button>
        </Can>
      </div>

      {form && (
        <Card title={form.id ? "Editar contacto" : "Crear contacto"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Empresa</Label>
              <Select
                value={form.companyId || undefined}
                onValueChange={(v) => setForm({ ...form, companyId: v })}
              >
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
                <th className="pb-2 font-medium">Cargo</th>
                <th className="pb-2 font-medium">Empresa</th>
                <th className="pb-2 font-medium">Contacto</th>
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
              {!isLoading && contacts?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Sin contactos todavía.
                  </td>
                </tr>
              )}
              {contacts?.map((contact) => (
                <tr key={contact.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">{contact.name}</td>
                  <td className="py-3 text-muted-foreground">{contact.position || "—"}</td>
                  <td className="py-3 text-muted-foreground">{companyName(contact.companyId)}</td>
                  <td className="py-3 text-muted-foreground">{contact.email || contact.phone || "—"}</td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Can permission="crm.contacts.update">
                        <button
                          onClick={() => startEdit(contact)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Can>
                      <Can permission="crm.contacts.delete">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar el contacto ${contact.name}?`)) deleteMutation.mutate(contact.id);
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
