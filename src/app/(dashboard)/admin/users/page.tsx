"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usersService, type ApiUser } from "@/services/users.service";
import { rolesService } from "@/services/roles.service";
import { Ban, CheckCircle2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface FormState {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  roleId: string;
  status: "ACTIVE" | "INACTIVE";
}

const emptyForm: FormState = { name: "", email: "", phone: "", password: "", roleId: "", status: "ACTIVE" };

const formatLastLogin = (value: string | null) =>
  value ? new Date(value).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }) : "Nunca";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: usersService.getAll,
  });

  const filteredUsers = users?.filter((user) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-roles-catalog"],
    queryFn: rolesService.getAll,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const createMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      toast.success("Usuario creado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo crear el usuario"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: FormState) =>
      usersService.update(id!, {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        roleId: data.roleId,
        status: data.status,
      }),
    onSuccess: () => {
      toast.success("Usuario actualizado");
      setForm(null);
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar el usuario"),
  });

  const deleteMutation = useMutation({
    mutationFn: usersService.remove,
    onSuccess: () => {
      toast.success("Usuario eliminado");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo eliminar el usuario"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (user: ApiUser) =>
      usersService.update(user.id, { status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }),
    onSuccess: (_, user) => {
      toast.success(user.status === "ACTIVE" ? "Usuario desactivado" : "Usuario activado");
      invalidate();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo cambiar el estado"),
  });

  const startCreate = () => setForm({ ...emptyForm, roleId: roles?.[0]?.id ?? "" });
  const startEdit = (user: ApiUser) =>
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      password: "",
      roleId: user.roleId,
      status: user.status,
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        roleId: form.roleId,
        status: form.status,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">Gestión de usuarios del sistema</p>
        </div>
        <Button variant="corporate" onClick={startCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo usuario
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o correo…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {form && (
        <Card title={form.id ? "Editar usuario" : "Crear usuario"}>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                type="tel"
                placeholder="3011234567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            {!form.id && (
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input
                  required
                  minLength={8}
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={form.roleId} onValueChange={(v) => setForm({ ...form, roleId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles?.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "ACTIVE" | "INACTIVE" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
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
                <th className="pb-2 font-medium">Correo</th>
                <th className="pb-2 font-medium">Teléfono</th>
                <th className="pb-2 font-medium">Rol</th>
                <th className="pb-2 font-medium">Estado</th>
                <th className="pb-2 font-medium">Último acceso</th>
                <th className="pb-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted-foreground">
                    Cargando…
                  </td>
                </tr>
              )}
              {!isLoading && filteredUsers?.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted-foreground">
                    Ningún usuario coincide con la búsqueda.
                  </td>
                </tr>
              )}
              {filteredUsers?.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3 text-muted-foreground">{user.phone ?? "—"}</td>
                  <td className="py-3">{user.roleName}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {user.status === "ACTIVE" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{formatLastLogin(user.lastLogin)}</td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleStatusMutation.mutate(user)}
                        className={`rounded p-1.5 text-slate-500 hover:bg-slate-100 ${
                          user.status === "ACTIVE" ? "hover:text-red-600" : "hover:text-emerald-600"
                        }`}
                        aria-label={user.status === "ACTIVE" ? "Desactivar" : "Activar"}
                        title={user.status === "ACTIVE" ? "Desactivar" : "Activar"}
                      >
                        {user.status === "ACTIVE" ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(user)}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar a ${user.name}?`)) deleteMutation.mutate(user.id);
                        }}
                        className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
