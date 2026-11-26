"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { rolesService, permissionsService, type ApiRole } from "@/services/roles.service";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface FormState {
  id?: string;
  name: string;
  description: string;
  permissionKeys: string[];
  isSystem?: boolean;
}

const emptyForm: FormState = { name: "", description: "", permissionKeys: [] };

export default function AdminRolesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);

  const { data: roles, isLoading } = useQuery({ queryKey: ["admin-roles"], queryFn: rolesService.getAll });
  const { data: permissions } = useQuery({ queryKey: ["admin-permissions"], queryFn: permissionsService.getAll });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-roles"] });

  const createMutation = useMutation({
    mutationFn: rolesService.create,
    onSuccess: () => {
      toast.success("Rol creado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear el rol"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name, description, permissionKeys }: FormState) =>
      rolesService.update(id!, { description, permissionKeys }),
    onSuccess: () => {
      toast.success("Rol actualizado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar el rol"),
  });

  const deleteMutation = useMutation({
    mutationFn: rolesService.remove,
    onSuccess: () => {
      toast.success("Rol eliminado");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar el rol (¿es un rol del sistema?)"),
  });

  const startEdit = (role: ApiRole) =>
    setForm({ id: role.id, name: role.name, description: role.description, permissionKeys: [...role.permissionKeys], isSystem: role.isSystem });

  const togglePermission = (key: string) => {
    if (!form) return;
    const has = form.permissionKeys.includes(key);
    setForm({
      ...form,
      permissionKeys: has ? form.permissionKeys.filter((k) => k !== key) : [...form.permissionKeys, key],
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate({ name: form.name, description: form.description, permissionKeys: form.permissionKeys });
    }
  };

  const groupedPermissions = (permissions ?? []).reduce<Record<string, typeof permissions>>((acc, p) => {
    (acc[p.module] ??= []).push(p);
    return acc;
  }, {} as any);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Roles</h1>
          <p className="text-muted-foreground">Roles y permisos del sistema</p>
        </div>
        <Button variant="corporate" onClick={() => setForm({ ...emptyForm })}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo rol
        </Button>
      </div>

      {form && (
        <Card title={form.id ? `Editar rol: ${form.name}` : "Crear rol"}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  required
                  disabled={!!form.id}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Permisos</Label>
              <div className="grid gap-3 rounded-lg border p-3 md:grid-cols-3">
                {Object.entries(groupedPermissions).map(([module, perms]) => (
                  <div key={module}>
                    <p className="mb-1 text-xs font-semibold uppercase text-slate-400">{module}</p>
                    {perms?.map((p) => (
                      <label key={p.key} className="mb-1 flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={form.permissionKeys.includes(p.key)}
                          onCheckedChange={() => togglePermission(p.key)}
                        />
                        {p.key}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
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
                <th className="pb-2 font-medium">Rol</th>
                <th className="pb-2 font-medium">Descripción</th>
                <th className="pb-2 font-medium">Permisos</th>
                <th className="pb-2 font-medium">Origen</th>
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
              {roles?.map((role) => (
                <tr key={role.id} className="border-b last:border-0 align-top">
                  <td className="py-3 font-medium">{role.name}</td>
                  <td className="py-3 text-muted-foreground">{role.description}</td>
                  <td className="py-3 text-muted-foreground">{role.permissionKeys.length} permisos</td>
                  <td className="py-3">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {role.isSystem ? "Sistema" : "Personalizado"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(role)}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {!role.isSystem && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar el rol ${role.name}?`)) deleteMutation.mutate(role.id);
                          }}
                          className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
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
