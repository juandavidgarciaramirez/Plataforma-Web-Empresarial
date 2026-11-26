"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Can } from "@/components/atoms/Can";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, ShieldCheck, Pencil, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { settingsService, type ApiSetting } from "@/services/settings.service";

function SystemSettingsCard() {
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const { data: settings, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: settingsService.getAll });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => settingsService.update(key, value),
    onSuccess: () => {
      toast.success("Configuración actualizada");
      setEditingKey(null);
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "No se pudo actualizar"),
  });

  const startEdit = (setting: ApiSetting) => {
    setEditingKey(setting.key);
    setDraft(setting.value ?? "");
  };

  return (
    <Can permission="foundation.settings.read">
      <Card title="Configuración del sistema" description="foundation.system_settings — valores reales usados por el backend.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 font-medium">Clave</th>
                <th className="pb-2 font-medium">Valor</th>
                <th className="pb-2 font-medium">Descripción</th>
                <th className="pb-2 font-medium">Pública</th>
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
              {settings?.map((setting) => (
                <tr key={setting.key} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs text-slate-900">{setting.key}</td>
                  <td className="py-3">
                    {editingKey === setting.key ? (
                      <Input value={draft} onChange={(e) => setDraft(e.target.value)} className="h-8 w-40" />
                    ) : (
                      <span className="text-muted-foreground">{setting.value ?? "—"}</span>
                    )}
                  </td>
                  <td className="py-3 text-muted-foreground">{setting.description ?? "—"}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        setting.isPublic ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {setting.isPublic ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      {editingKey === setting.key ? (
                        <>
                          <button
                            onClick={() => updateMutation.mutate({ key: setting.key, value: draft })}
                            className="rounded p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                            aria-label="Guardar"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            aria-label="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <Can permission="foundation.settings.update">
                          <button
                            onClick={() => startEdit(setting)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                            aria-label="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Can>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Can>
  );
}

export default function AdminSettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Tu cuenta, sesión y configuración del sistema</p>
      </div>

      <Card title="Perfil">
        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Nombre</dt>
            <dd className="font-medium">{user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Correo</dt>
            <dd className="font-medium">{user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Rol</dt>
            <dd className="font-medium">{user?.roleName ?? "—"}</dd>
          </div>
        </dl>
      </Card>

      <SystemSettingsCard />

      <Card title="Permisos activos">
        <div className="flex flex-wrap gap-2">
          {user?.permissions?.length ? (
            user.permissions.map((permission) => (
              <span
                key={permission}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
              >
                <ShieldCheck className="h-3 w-3" />
                {permission}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Sin permisos cargados.</p>
          )}
        </div>
      </Card>

      <Card title="Sesión">
        <p className="mb-4 text-sm text-muted-foreground">
          Cierra tu sesión en este dispositivo. El refresh token quedará revocado en el servidor.
        </p>
        <Button variant="destructive" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
        </Button>
      </Card>
    </div>
  );
}
